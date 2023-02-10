import { authService } from '@/firebase';
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Router, useRouter } from 'next/router';
import test from 'node:test';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');
  const [photoURL, setPhotoURL] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');

  const router = useRouter();

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(authService, email, password);
      if (authService.currentUser?.emailVerified === true) {
        alert('로그인 완료');
        //router.push('/');
      } else {
        authService.signOut();
        alert('이메일 인증을 완료해주세요.');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user !== null) {
        user.providerData.forEach((profile) => {
          if (profile.displayName !== null) {
            const authDisplayName = profile.displayName;
            setNickName(authDisplayName);
          }
          if (profile.photoURL !== null) {
            const authPhotoURL = profile.photoURL;
            setPhotoURL(authPhotoURL);
          }
        });
      }
    });
  }, []);

  console.log(authService.currentUser);

  return (
    <div>
      <img src={photoURL} width="100px" />
      <p>닉네임: {nickName} </p>
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        placeholder="이메일"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => {
          setPassWord(e.target.value);
        }}
        placeholder="비밀번호"
      />
      <button onClick={signIn}>완료</button>
    </div>
  );
};

export default SignIn;
