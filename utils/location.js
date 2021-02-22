


export function getLocationCoords() {
    let promise = new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => resolve(position.coords), (error) => reject(error.message))
    });
    return promise
}