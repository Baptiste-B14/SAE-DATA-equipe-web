async function queryAPI(url, paramsDict) {
    const promise = await fetch(url)
    return await promise.json()
}