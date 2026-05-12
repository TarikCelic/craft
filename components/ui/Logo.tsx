import Image from 'next/image';
import logo from '@/public/logo.png';
export default function Logo() {
  return (
    <div className="relative w-40 h-5">
      <Image src={logo} fill alt="logo" />
    </div>
  );
}
