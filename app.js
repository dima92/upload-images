import firebase from 'firebase/app'
import 'firebase/storage'
import {upload} from './upload.js'


const firebaseConfig = {
    apiKey: "AIzaSyAa1YW7nXpeWxoFlg-peM5JjDHwinjyNOA",
    authDomain: "upload-d2389.firebaseapp.com",
    projectId: "upload-d2389",
    storageBucket: "upload-d2389.appspot.com",
    messagingSenderId: "361170868493",
    appId: "1:361170868493:web:8db0364d63bad24a1b7844"
}

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
            const ref = storage.ref(`images/${file.name}`)
            const task = ref.put(file)

            task.on('state_changed', snapshot => {
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
                const block = blocks[index].querySelector('.preview-info-progress')
                block.textContent = percentage
                block.style.width = percentage
            }, error => {
                console.log(error)
            }, () => {
                task.snapshot.ref.getDownloadURL().then(url => {
                    console.log('Download URL', url)
                })
            })
        })
    }
})
