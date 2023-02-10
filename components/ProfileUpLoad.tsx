import { storage } from '@/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { useState, useRef } from 'react';
import styled from 'styled-components';

// storage 이미지 업로드 후 불러오기
const UploadImage = ({
  imageURL,
  setImageURL,
}: {
  imageURL: string;
  setImageURL: (p: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const onImageChange = (
    e: React.ChangeEvent<EventTarget & HTMLInputElement>,
  ) => {
    e.preventDefault();
    const file = e.target.files;
    if (!file) return null;
    const storegeRef = ref(storage, `files/${file[0].name}`);
    const uploadTask = uploadBytesResumable(storegeRef, file[0]);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        setProgressPercent(progress);
      },
      (error) => {
        switch (error.code) {
          case 'sotrage/canceled':
            alert('업로드 취소');
            break;
        }
      },
      () => {
        e.target.value = '';
        getDownloadURL(storegeRef).then((downloadURL) => {
          console.log('파일 이미지', downloadURL);
          setImageURL(downloadURL);
        });
      },
    );
  };
  return (
    <div>
      <label htmlFor="input-file">
        <PhotoBox>
          {imageURL ? (
            <Photo src={imageURL} />
          ) : (
            <Photo
              src="https://blog.kakaocdn.net/dn/c3vWTf/btqUuNfnDsf/VQMbJlQW4ywjeI8cUE91OK/img.jpg"
              width="100px"
            />
          )}
        </PhotoBox>
      </label>
      <PhotoInput
        id="input-file"
        type="file"
        ref={inputRef}
        name="images"
        onChange={onImageChange}
        accept="image/*"
      />
    </div>
  );
};

export default UploadImage;

const PhotoInput = styled.input`
  display: none;
`;
const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const PhotoBox = styled.div`
  width: 150px;
  height: 150px;
  margin-left: 8vw;
  margin-bottom: 2vh;
  border-radius: 70%;
  overflow: hidden;
  :hover {
    cursor: pointer;
  }
`;
