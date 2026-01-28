import { redirect } from 'next/navigation';

export default function Home() {
  // Kullanıcı ana sayfaya girince direkt profil seçme ekranına gitsin
  redirect('/profiles');
}