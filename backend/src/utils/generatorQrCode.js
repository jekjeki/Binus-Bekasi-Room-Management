import { toDataURL, QRCodeToDataURLOptions } from "qrcode";

const options = {
    width: 400,
    margin: 2
}

export const getQrCode = (value) => {
    let qrVal = undefined

    toDataURL(value, options, (err, url)=>{
        if(err) console.log(err)

        qrVal = url
    })
    return qrVal
}

