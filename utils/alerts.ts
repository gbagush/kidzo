import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const correctMessages = [
  "🦄 Wow keren!",
  "🎉 Mantap!",
  "👍 Bagus sekali!",
  "🏆 Kamu hebat!",
  "🚀 Luar biasa!",
  "🌟 Cemerlang!",
  "✨ Luar biasa sekali!",
  "👏 Kerja bagus!",
  "🎖️ Kamu mengagumkan!",
  "🏅 Medali untukmu!",
  "🏆 Juara!",
  "🎉 Perayaan untukmu!",
  "🌟 Bintang kelas!",
];

const wrongMessages = [
  "😢 Coba lagi ya!",
  "🚫 Jawaban tidak tepat!",
  "😞 Jangan menyerah!",
  "🙁 Jangan putus asa!",
  "🔄 Ayo, coba lagi!",
  "😅 Tenang, coba lagi!",
  "😟 Tidak masalah, coba lagi!",
];

const getRandomMessage = (messages: string[]) => {
  return messages[Math.floor(Math.random() * messages.length)];
};

const correctAllert = (theme: string) => {
  const message = getRandomMessage(correctMessages);

  toast(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    pauseOnFocusLoss: false,
    draggable: true,
    progress: undefined,
    theme: theme,
    transition: Bounce,
  });
};

const wrongAllert = (theme: string) => {
  const message = getRandomMessage(wrongMessages);

  toast.error(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    pauseOnFocusLoss: false,
    draggable: true,
    progress: undefined,
    theme: theme,
    transition: Bounce,
  });
};

const errorAllert = (message: string, theme: string) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    pauseOnFocusLoss: false,
    draggable: true,
    progress: undefined,
    theme: theme,
    transition: Bounce,
  });
};

export { correctAllert, wrongAllert, errorAllert };
