export const fetchData = <T,>(url: string, queryParams?: Record<string, string>) => (
    setData: (data: T) => void,
    setLoading: (loading: boolean) => void = () => {},
    setError: (error: string) => void = () => {},
    navigate?: any,
) => {
    console.log(localStorage.getItem('jwt'))
    let token = localStorage.getItem('jwt');

    // Check if token is wrapped in double quotes and remove them.
    if (token && token.startsWith('"') && token.endsWith('"')) {
        token = token.substring(1, token.length - 1);
    }

    if (queryParams) {
        const queryString = Object.keys(queryParams)
            .map((key) => `${key}=${queryParams[key]}`)
            .join('&');
        url += `?${queryString}`;
    }

    fetch(url, {
        headers : {
            'Authorization': `Bearer ${token}`,
        }
        
    }).then((response) => {
        if(response.ok) {
            return response.json();
        }
        console.log(response.status)
        if(response.status == 401) {
            if(navigate) navigate("/loggedOut")
        }
        setError(response.statusText);
    }).then(data =>{
        console.log('data', data)
        setData(data);
    })
    .catch((e) => {
        setError(e.errorMessage);
    }).finally(() => {
        setLoading(false);
    });
}

const genericQuery = (method: string) => <T,R,>(url: string, data: T) => (
    setData: (data: R) => void = () => {},
    setLoading: (loading: boolean) => void = () => {},
    setError: (error: string) => void = () => {},
    navigate?: any
) => {
    let token = localStorage.getItem('jwt');

    // Check if token is wrapped in double quotes and remove them.
    if (token && token.startsWith('"') && token.endsWith('"')) {
        token = token.substring(1, token.length - 1);
    }
    
    fetch(url, {
        method,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    }).then((response) => {
        console.log('response', response)
        if(response.ok) {
            return response.json();
        }
        console.log(response.status)
        if(response.status == 401) {
           if(navigate) navigate("/loggedOut")
        }
        setError(response.statusText);
    }).then(data =>{
        console.log('data', data)
        setData(data);
    })
    .catch((e) => {
        setError(e.errorMessage);
    }).finally(() => {
        setLoading(false);
    });
}

export const postData = genericQuery('POST');
export const putData = genericQuery('PUT');
export const deleteData = genericQuery('DELETE');
