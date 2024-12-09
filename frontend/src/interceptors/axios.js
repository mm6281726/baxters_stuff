import axios from "axios";

axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'

let refresh = false;
axios.interceptors.response.use(resp => resp, async error => {
    if (error.response.status === 401 && !refresh) {
        refresh = true;
        const response = await
            axios.post('/api/accounts/login/refresh/', {
                refresh: localStorage.getItem('refresh')
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }, { withCredentials: true });
            
        if (response.status === 200) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data['access']}`;
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            return axios(error.config);
        }
    }
    refresh = false;
    return error;
});