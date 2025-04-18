from django.test import TestCase
from decimal import Decimal
from ..services.unit_conversion import convert_units, get_unit_type

class UnitConversionTests(TestCase):
    def test_get_unit_type(self):
        """Test the get_unit_type function"""
        self.assertEqual(get_unit_type('g'), 'weight')
        self.assertEqual(get_unit_type('kg'), 'weight')
        self.assertEqual(get_unit_type('oz'), 'weight')
        self.assertEqual(get_unit_type('lb'), 'weight')
        
        self.assertEqual(get_unit_type('ml'), 'volume')
        self.assertEqual(get_unit_type('l'), 'volume')
        self.assertEqual(get_unit_type('tsp'), 'volume')
        self.assertEqual(get_unit_type('tbsp'), 'volume')
        self.assertEqual(get_unit_type('cup'), 'volume')
        
        self.assertEqual(get_unit_type(''), 'count')
        self.assertEqual(get_unit_type(None), 'count')
        self.assertEqual(get_unit_type('piece'), 'count')
    
    def test_convert_same_unit(self):
        """Test conversion between the same unit"""
        self.assertEqual(convert_units(100, 'g', 'g'), Decimal('100'))
        self.assertEqual(convert_units(2.5, 'cup', 'cup'), Decimal('2.5'))
    
    def test_convert_weight_units(self):
        """Test conversion between weight units"""
        # 1 kg = 1000 g
        self.assertEqual(convert_units(1, 'kg', 'g'), Decimal('1000'))
        self.assertEqual(convert_units(1000, 'g', 'kg'), Decimal('1'))
        
        # 1 lb = 453.59 g
        self.assertAlmostEqual(float(convert_units(1, 'lb', 'g')), 453.59, places=2)
        self.assertAlmostEqual(float(convert_units(453.59, 'g', 'lb')), 1, places=2)
        
        # 1 lb = 16 oz
        self.assertAlmostEqual(float(convert_units(1, 'lb', 'oz')), 16, places=1)
        self.assertAlmostEqual(float(convert_units(16, 'oz', 'lb')), 1, places=1)
    
    def test_convert_volume_units(self):
        """Test conversion between volume units"""
        # 1 l = 1000 ml
        self.assertEqual(convert_units(1, 'l', 'ml'), Decimal('1000'))
        self.assertEqual(convert_units(1000, 'ml', 'l'), Decimal('1'))
        
        # 1 cup = 236.59 ml
        self.assertAlmostEqual(float(convert_units(1, 'cup', 'ml')), 236.59, places=2)
        self.assertAlmostEqual(float(convert_units(236.59, 'ml', 'cup')), 1, places=2)
        
        # 1 tbsp = 3 tsp
        self.assertAlmostEqual(float(convert_units(1, 'tbsp', 'tsp')), 3, places=1)
        self.assertAlmostEqual(float(convert_units(3, 'tsp', 'tbsp')), 1, places=1)
    
    def test_convert_weight_to_volume(self):
        """Test conversion between weight and volume units"""
        # 100g of water = 100ml (density = 1.0)
        self.assertAlmostEqual(float(convert_units(100, 'g', 'ml', 'water')), 100, places=1)
        self.assertAlmostEqual(float(convert_units(100, 'ml', 'g', 'water')), 100, places=1)
        
        # 100g of flour = 188.68ml (density = 0.53)
        self.assertAlmostEqual(float(convert_units(100, 'g', 'ml', 'flour')), 188.68, places=1)
        self.assertAlmostEqual(float(convert_units(188.68, 'ml', 'g', 'flour')), 100, places=1)
    
    def test_invalid_conversions(self):
        """Test invalid conversions"""
        # Cannot convert between a unit and no unit
        with self.assertRaises(ValueError):
            convert_units(100, 'g', '')
        
        with self.assertRaises(ValueError):
            convert_units(100, '', 'g')
        
        # Cannot convert between different count units
        with self.assertRaises(ValueError):
            convert_units(1, 'piece', 'slice')
        
        # Cannot convert between weight and volume without ingredient
        with self.assertRaises(ValueError):
            convert_units(100, 'g', 'ml')
