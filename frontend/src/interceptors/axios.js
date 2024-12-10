import axios from "axios";

axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'

axios.defaults.headers.common['Authorization'] = `JWT ${localStorage.getItem('access')}`;

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
            const access = response.data.access
            const access_header = `JWT ${access}`;
            axios.defaults.headers.common['Authorization'] = access_header;
            error.config.headers['Authorization'] = access_header;
            localStorage.setItem('access', access);
            localStorage.setItem('refresh', response.data.refresh);
            return axios(error.config);
        }
    }
    refresh = false;
    return error;
});