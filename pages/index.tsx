import Link from 'next/link';
import { authService, dbService } from '@/firebase';
import { updateDoc, doc } from 'firebase/firestore';

const Home = () => {
  const onLogout = async () => {
    try {
      const user = authService.currentUser;
      if (user !== null) {
        authService.signOut();
        await updateDoc(doc(dbService, 'profile', user.uid), {
          loginState: false,
        });
      }
      alert('로그아웃');
    } catch {
      (error: any) => {
        alert(error);
      };
    }
  };

  return (
    <div>
      <Link href="/signUp">회원가입</Link>
      <Link href="/signIn">로그인</Link>
      <Link href="/myPage">마이페이지</Link>
      <p></p>
      <button onClick={onLogout}>로그아웃</button>
    </div>
  );
};

export default Home;
