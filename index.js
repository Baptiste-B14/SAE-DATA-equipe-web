async function queryAPI(url, paramsDict) {
    const promise = await fetch(url)
    return await promise.json()
}

const span = document.getElementById("span")
queryAPI("http://127.0.0.1:5000/", {}).then(x => {
    span.innerText = x["message"]
    console.log(x["test"]['type'])
})