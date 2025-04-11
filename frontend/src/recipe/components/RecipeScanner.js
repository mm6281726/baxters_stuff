import React, { useState, useRef } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Alert,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from 'reactstrap';
import axios from 'axios';

// Custom styles for alignment
const styles = {
  ingredientDeleteButton: {
    marginTop: '38px',
    display: 'block'
  },
  stepNumber: {
    marginTop: '18px',
    display: 'block'
  },
  stepDeleteButton: {
    marginTop: '18px',
    display: 'block'
  },
  imagePreview: {
    maxWidth: '100%',
    maxHeight: '300px',
    marginTop: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  }
};

const RecipeScanner = ({ isOpen, toggle, onScanComplete }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scannedRecipe, setScannedRecipe] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('url');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [progress, setProgress] = useState({
    status: 'idle',
    progress: 0,
    message: ''
  });

  // Reset the form when the modal is opened
  React.useEffect(() => {
    if (isOpen) {
      setUrl('');
      setError('');
      setScannedRecipe(null);
      setShowPreview(false);
      setLoading(false);
      setImageFile(null);
      setImagePreview(null);
      setActiveTab('url');
      setProgress({
        status: 'idle',
        progress: 0,
        message: ''
      });
    }
  }, [isOpen]);

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image file is too large. Maximum size is 10MB.');
        return;
      }

      if (!file.type.match('image.*')) {
        setError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      setImageFile(file);
      setError('');

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (activeTab === 'url') {
      await scanUrl();
    } else {
      await scanImage();
    }
  };

  const scanUrl = async () => {
    // Validate URL
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    // Basic URL validation
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setProgress({
        status: 'processing',
        progress: 10,
        message: 'Starting URL processing...'
      });

      // Call the API to scan the URL
      const response = await axios.post('/api/recipes/scan/', { url });

      // Check if we got valid recipe data
      if (!response.data || !response.data.title) {
        setError('Could not extract recipe data from this URL. Please try another recipe page.');
        setProgress({
          status: 'error',
          progress: 0,
          message: 'Failed to extract recipe data'
        });
        setLoading(false);
        return;
      }

      // Check if we have ingredients
      if (!response.data.ingredients || response.data.ingredients.length === 0) {
        setError('Could not extract ingredients from this recipe. Please try another recipe page.');
        setProgress({
          status: 'error',
          progress: 0,
          message: 'Failed to extract ingredients'
        });
        setLoading(false);
        return;
      }

      // Update progress from response if available
      if (response.data.progress) {
        setProgress(response.data.progress);
      } else {
        setProgress({
          status: 'complete',
          progress: 100,
          message: 'Recipe processing complete!'
        });
      }

      // Set the scanned recipe data
      setScannedRecipe(response.data);
      setShowPreview(true);
    } catch (err) {
      console.error('Error scanning recipe:', err);
      setError(err.response?.data?.error || 'Failed to scan recipe. Please try another URL or try again later.');
      setProgress({
        status: 'error',
        progress: 0,
        message: 'Error: ' + (err.response?.data?.error || 'Failed to scan recipe')
      });
      // Make sure we don't advance to the next step
      setShowPreview(false);
    } finally {
      setLoading(false);
    }
  };

  const scanImage = async () => {
    // Validate image
    if (!imageFile) {
      setError('Please select an image file');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setProgress({
        status: 'processing',
        progress: 10,
        message: 'Starting image processing...'
      });

      // Create form data
      const formData = new FormData();
      formData.append('image', imageFile);

      // Call the API to scan the image
      const response = await axios.post('/api/recipes/scan-image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Check if we got valid recipe data
      if (!response.data || !response.data.title) {
        setError('Could not extract recipe data from this image. Please try another image or adjust the image quality.');
        setProgress({
          status: 'error',
          progress: 0,
          message: 'Failed to extract recipe data from image'
        });
        setLoading(false);
        return;
      }

      // Update progress from response if available
      if (response.data.progress) {
        setProgress(response.data.progress);
      } else {
        setProgress({
          status: 'complete',
          progress: 100,
          message: 'Recipe processing complete!'
        });
      }

      // Set the scanned recipe data
      setScannedRecipe(response.data);
      setShowPreview(true);
    } catch (err) {
      console.error('Error scanning recipe image:', err);
      setError(err.response?.data?.error || 'Failed to scan recipe image. Please try another image or adjust the image quality.');
      setProgress({
        status: 'error',
        progress: 0,
        message: 'Error: ' + (err.response?.data?.error || 'Failed to scan recipe image')
      });
      // Make sure we don't advance to the next step
      setShowPreview(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

      // Validate that we have required fields
      if (!scannedRecipe.title) {
        setError('Recipe title is required');
        setLoading(false);
        return;
      }

      // Make sure we have at least one ingredient
      if (!scannedRecipe.ingredients || scannedRecipe.ingredients.length === 0) {
        setError('At least one ingredient is required');
        setLoading(false);
        return;
      }

      // Call the API to create a recipe from the scanned data
      const response = await axios.post('/api/recipes/create-from-scan/', scannedRecipe);

      // Close the modal and notify parent component
      toggle();
      onScanComplete(response.data);
    } catch (err) {
      console.error('Error saving recipe:', err);
      setError(err.response?.data?.error || 'Failed to save recipe. Please try again.');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (showPreview) {
      // Go back to input screen
      setShowPreview(false);
      setScannedRecipe(null);
    } else {
      // Close the modal
      toggle();
    }
  };

  // Update scanned recipe data
  const handleRecipeChange = (e) => {
    const { name, value } = e.target;
    setScannedRecipe({
      ...scannedRecipe,
      [name]: value
    });
  };

  // Update ingredient data
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...scannedRecipe.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value
    };

    setScannedRecipe({
      ...scannedRecipe,
      ingredients: updatedIngredients
    });
  };

  // Update step data
  const handleStepChange = (index, value) => {
    const updatedSteps = [...scannedRecipe.steps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      description: value
    };

    setScannedRecipe({
      ...scannedRecipe,
      steps: updatedSteps
    });
  };

  // Add a new ingredient
  const handleAddIngredient = () => {
    const updatedIngredients = [...scannedRecipe.ingredients, {
      name: '',
      quantity: 1,
      unit: '',
      notes: ''
    }];

    setScannedRecipe({
      ...scannedRecipe,
      ingredients: updatedIngredients
    });
  };

  // Add a new step
  const handleAddStep = () => {
    const updatedSteps = [...scannedRecipe.steps, {
      step_number: scannedRecipe.steps.length + 1,
      description: ''
    }];

    setScannedRecipe({
      ...scannedRecipe,
      steps: updatedSteps
    });
  };

  // Remove an ingredient
  const handleRemoveIngredient = (index) => {
    const updatedIngredients = [...scannedRecipe.ingredients];
    updatedIngredients.splice(index, 1);

    setScannedRecipe({
      ...scannedRecipe,
      ingredients: updatedIngredients
    });
  };

  // Remove a step
  const handleRemoveStep = (index) => {
    const updatedSteps = [...scannedRecipe.steps];
    updatedSteps.splice(index, 1);

    // Update step numbers
    const reorderedSteps = updatedSteps.map((step, i) => ({
      ...step,
      step_number: i + 1
    }));

    setScannedRecipe({
      ...scannedRecipe,
      steps: reorderedSteps
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        {showPreview ? 'Review Scanned Recipe' : 'Recipe Scanner'}
      </ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center my-4">
            <Spinner color="primary" />
            <p className="mt-2">
              {showPreview ? 'Saving recipe...' : (progress.message || 'Scanning recipe...')}
            </p>
            {progress.status === 'processing' && (
              <div className="progress mt-3">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${progress.progress}%` }}
                  aria-valuenow={progress.progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {progress.progress}%
                </div>
              </div>
            )}
          </div>
        ) : showPreview && scannedRecipe ? (
          <Form>
            <FormGroup>
              <Label for="title">Recipe Title</Label>
              <Input
                type="text"
                name="title"
                id="title"
                value={scannedRecipe.title || ''}
                onChange={handleRecipeChange}
              />
            </FormGroup>

            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                value={scannedRecipe.description || ''}
                onChange={handleRecipeChange}
              />
            </FormGroup>

            <div className="row">
              <div className="col-md-4">
                <FormGroup>
                  <Label for="prep_time">Prep Time (minutes)</Label>
                  <Input
                    type="number"
                    name="prep_time"
                    id="prep_time"
                    value={scannedRecipe.prep_time || ''}
                    onChange={handleRecipeChange}
                  />
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup>
                  <Label for="cook_time">Cook Time (minutes)</Label>
                  <Input
                    type="number"
                    name="cook_time"
                    id="cook_time"
                    value={scannedRecipe.cook_time || ''}
                    onChange={handleRecipeChange}
                  />
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup>
                  <Label for="servings">Servings</Label>
                  <Input
                    type="number"
                    name="servings"
                    id="servings"
                    value={scannedRecipe.servings || ''}
                    onChange={handleRecipeChange}
                  />
                </FormGroup>
              </div>
            </div>

            <h5 className="mt-4">Ingredients</h5>
            {scannedRecipe.ingredients.map((ingredient, index) => (
              <div key={`ingredient-${index}`} className="row mb-2 align-items-end">
                <div className="col-md-4">
                  <FormGroup>
                    <Label for={`ingredient-name-${index}`}>Name</Label>
                    <Input
                      type="text"
                      id={`ingredient-name-${index}`}
                      value={ingredient.name || ''}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    />
                  </FormGroup>
                </div>
                <div className="col-md-2">
                  <FormGroup>
                    <Label for={`ingredient-quantity-${index}`}>Quantity</Label>
                    <Input
                      type="number"
                      id={`ingredient-quantity-${index}`}
                      value={ingredient.quantity || ''}
                      onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                      step="0.01"
                    />
                  </FormGroup>
                </div>
                <div className="col-md-2">
                  <FormGroup>
                    <Label for={`ingredient-unit-${index}`}>Unit</Label>
                    <Input
                      type="text"
                      id={`ingredient-unit-${index}`}
                      value={ingredient.unit || ''}
                      onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    />
                  </FormGroup>
                </div>
                <div className="col-md-3">
                  <FormGroup>
                    <Label for={`ingredient-notes-${index}`}>Notes</Label>
                    <Input
                      type="text"
                      id={`ingredient-notes-${index}`}
                      value={ingredient.notes || ''}
                      onChange={(e) => handleIngredientChange(index, 'notes', e.target.value)}
                    />
                  </FormGroup>
                </div>
                <div className="col-md-1 d-flex align-items-center justify-content-center">
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleRemoveIngredient(index)}
                    style={styles.ingredientDeleteButton}
                  >
                    &times;
                  </Button>
                </div>
              </div>
            ))}
            <Button
              color="secondary"
              size="sm"
              onClick={handleAddIngredient}
              className="mb-3"
            >
              Add Ingredient
            </Button>

            <h5 className="mt-4">Steps</h5>
            {scannedRecipe.steps.map((step, index) => (
              <div key={`step-${index}`} className="row mb-2 align-items-center">
                <div className="col-md-1 d-flex align-items-center justify-content-center">
                  <strong style={styles.stepNumber}>{step.step_number}.</strong>
                </div>
                <div className="col-md-10">
                  <FormGroup>
                    <Input
                      type="textarea"
                      id={`step-${index}`}
                      value={step.description || ''}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      rows="2"
                    />
                  </FormGroup>
                </div>
                <div className="col-md-1 d-flex align-items-center justify-content-center">
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleRemoveStep(index)}
                    style={styles.stepDeleteButton}
                  >
                    &times;
                  </Button>
                </div>
              </div>
            ))}
            <Button
              color="secondary"
              size="sm"
              onClick={handleAddStep}
              className="mb-3"
            >
              Add Step
            </Button>
          </Form>
        ) : (
          <div>
            <Nav tabs className="mb-3">
              <NavItem>
                <NavLink
                  className={activeTab === 'url' ? 'active' : ''}
                  onClick={() => setActiveTab('url')}
                  style={{ cursor: 'pointer' }}
                >
                  Scan URL
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === 'image' ? 'active' : ''}
                  onClick={() => setActiveTab('image')}
                  style={{ cursor: 'pointer' }}
                >
                  Scan Image
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={activeTab}>
              <TabPane tabId="url">
                <Form>
                  <FormGroup>
                    <Label for="recipeUrl">Recipe URL</Label>
                    <Input
                      type="url"
                      name="recipeUrl"
                      id="recipeUrl"
                      placeholder="https://example.com/recipe"
                      value={url}
                      onChange={handleUrlChange}
                    />
                    <small className="form-text text-muted">
                      Enter the URL of a recipe webpage to scan and import.
                    </small>
                  </FormGroup>
                </Form>
              </TabPane>

              <TabPane tabId="image">
                <Form>
                  <FormGroup>
                    <Label for="recipeImage">Recipe Image</Label>
                    <div className="custom-file-upload">
                      <Input
                        type="file"
                        name="recipeImage"
                        id="recipeImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                      />
                    </div>
                    <small className="form-text text-muted">
                      Upload an image of a printed or handwritten recipe (max 10MB).
                    </small>

                    {imagePreview && (
                      <div className="image-preview-container mt-3">
                        <img
                          src={imagePreview}
                          alt="Recipe preview"
                          style={styles.imagePreview}
                        />
                      </div>
                    )}
                  </FormGroup>
                </Form>
              </TabPane>
            </TabContent>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleCancel}>
          {showPreview ? 'Back' : 'Cancel'}
        </Button>
        {showPreview ? (
          <Button color="primary" onClick={handleSave} disabled={loading}>
            Save Recipe
          </Button>
        ) : (
          <Button
            color="primary"
            onClick={handleScan}
            disabled={loading || (activeTab === 'url' ? !url : !imageFile)}
          >
            {activeTab === 'url' ? 'Scan URL' : 'Scan Image'}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default RecipeScanner;
