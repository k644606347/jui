window.testCallback = function () {
    return new Promise(function (resolve, reject) {
        resolve({
            isValid: false,
            // level: 'warn',
            msg: 'JS切面校验失败',
        })
    })
}