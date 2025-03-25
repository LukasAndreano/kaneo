import { AuthLayout } from "@/components/auth/layout";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { AuthToggle } from "@/components/auth/toggle";
import PageTitle from "@/components/page-title";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/sign-up")({
  component: SignUp,
});

function SignUp() {
  return (
    <>
      <PageTitle title="Создание учетной записи" />
      <AuthLayout
        title="Создание учетной записи"
        subtitle="Начните с бесплатной рабочей области"
      >
        <SignUpForm />
        <AuthToggle
          message="Уже есть учетная запись?"
          linkText="Войти"
          linkTo="/auth/sign-in"
        />
      </AuthLayout>
    </>
  );
}
