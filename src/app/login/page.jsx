import { signInWithGoogle } from '@/app/login/auth'

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Vocabula</h1>
        <p className="text-center mb-8">Please log in to continue</p>
        <div className="flex justify-center">
          <form action={signInWithGoogle}>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
