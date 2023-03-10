import { storage } from '@/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { useState, useRef } from 'react';
import styled from 'styled-components';
import imageCompression from 'browser-image-compression';

// storage 이미지 업로드 후 불러오기
const UploadImage = ({
  imageURL,
  setImageURL,
}: {
  imageURL: string;
  setImageURL: (p: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0); // 파일 업로드 상태 확인 가능
  //이미지 압축 및 업로드
  const onChangeImage = async (
    e: React.ChangeEvent<EventTarget & HTMLInputElement>,
  ) => {
    e.preventDefault();
    if (e.target.files !== null) {
      const file = e.target.files[0];
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 300,
        useWebWorker: true,
      };
      const compressionFile = await imageCompression(file, options);
      if (!compressionFile) return null;
      const storegeRef = ref(storage, `profile/${compressionFile.name}`);
      const uploadTask = uploadBytesResumable(storegeRef, compressionFile);
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
            setImageURL(downloadURL);
          });
        },
      );
    }
  };

  return (
    <UploadImageWrapper>
      <UploadContainer htmlFor="input-file">
        <PhotoBox>
          <Photo src={imageURL} />
          {99 > progressPercent && progressPercent > 1 ? (
            <>
              <ProgressPercent>
                <div>
                  <div>업로드중...</div>
                  <div>{progressPercent}%</div>
                </div>
              </ProgressPercent>
            </>
          ) : null}
        </PhotoBox>
        <IconImgBox>
          <IconImg src="/assets/icons/myPage/photo.svg" />
        </IconImgBox>
      </UploadContainer>
      <PhotoInput
        id="input-file"
        type="file"
        ref={inputRef}
        name="images"
        onChange={onChangeImage}
        accept="image/*"
      />
    </UploadImageWrapper>
  );
};

export default UploadImage;

const UploadImageWrapper = styled.div``;
const UploadContainer = styled.label`
  position: relative;

  width: 120px;
  height: 120px;
`;

const PhotoInput = styled.input`
  display: none;
`;
const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const PhotoBox = styled.div`
  width: 120px;
  height: 120px;
  margin: auto;
  margin-bottom: 2vh;
  border-radius: 70%;
  overflow: hidden;
  :hover {
    cursor: pointer;
  }
  position: relative;
  box-shadow: -2px 2px 0px 0px #000000;
  border-style: solid;
  border-width: 1px;
`;
const ProgressPercent = styled.div`
  display: flex;
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 70%;
  left: 0;
  top: 0;
  align-items: center;
  justify-content: center;
  background-color: #000000aa;
  color: white;
  z-index: 200;
`;
const IconImg = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  margin-top: 7px;
`;
const IconImgBox = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 2.5rem;
  height: 2.5rem;
  background-color: #ff4800;
  border-radius: 50%;
  border-style: solid;
  border-width: 1px;
  :hover {
    cursor: pointer;
  }
`;
