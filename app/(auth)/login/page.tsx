import { signIn } from "@/app/(auth)/actions";

interface Props {
  searchParams: Promise<{ error?: string; next?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { error, next } = await searchParams;

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex flex-col items-center">
          <span className="font-body text-xs font-normal text-white/60 tracking-widest uppercase mb-0.5">
            Medellín
          </span>
          <div className="font-heading text-3xl font-bold leading-none">
            <span className="text-white">Trip </span>
            <span className="text-[#2BB7A6]">Planner</span>
          </div>
        </div>
        <p className="mt-3 text-white/50 text-sm font-body">Acceso al portal</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl p-8 shadow-2xl">
        <h1 className="font-heading text-xl font-bold text-[#0D1B3D] mb-1">
          Iniciar sesión
        </h1>
        <p className="text-sm text-[#637489] font-body mb-6">
          Accede con tu cuenta para continuar
        </p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 font-body">
            {decodeURIComponent(error)}
          </div>
        )}

        <form action={signIn} className="space-y-4">
          <input type="hidden" name="next" value={next ?? "/admin"} />

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#0D1B3D] font-body mb-1.5"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="admin@ejemplo.com"
              className="w-full h-11 px-3.5 rounded-xl border border-[#E2E8ED] bg-[#F8FAFC] text-sm font-body text-[#0D1B3D] placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6] focus:border-transparent transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#0D1B3D] font-body mb-1.5"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="w-full h-11 px-3.5 rounded-xl border border-[#E2E8ED] bg-[#F8FAFC] text-sm font-body text-[#0D1B3D] placeholder:text-[#9DAAB5] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6] focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-[#2BB7A6] hover:bg-[#2BB7A6]/90 text-white font-body font-semibold text-sm rounded-xl transition-colors mt-2"
          >
            Ingresar
          </button>
        </form>
      </div>

      <p className="text-center text-white/30 text-xs font-body mt-6">
        Medellín Trip Planner © {new Date().getFullYear()}
      </p>
    </div>
  );
}
