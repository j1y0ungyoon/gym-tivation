import Link from 'next/link';
import { Router } from 'next/router';

const Home = () => {
  return (
    <div>
      <Link href="/signUp">회원가입</Link>
      <Link href="/signIn">로그인</Link>
    </div>
  );
};

export default Home;
