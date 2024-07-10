import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ImageInput from './ImageInput';
import firebase from '../firebaseConfig';


function ImagePicker({ imageChange }) {
  const [image, setImage] = useState('');
  const storage = firebase.storage();

  const handleUpload = async (value) => {
    const ImageUri = await uploadImageAsync(value)
    setImage(ImageUri);
    imageChange(ImageUri);
  };

  const uploadImageAsync = async (uri) => {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const ref = storage.ref(`image/${Date.now()}`)
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    return await snapshot.ref.getDownloadURL();
  }

  return (
    <View style={styles.container}>
      <ImageInput onChangeImage={handleUpload} imageUri={image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 10,
  },
});

export default ImagePicker;
