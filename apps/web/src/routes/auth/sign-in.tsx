import PageTitle from "@/components/page-title";
import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "../../components/auth/layout";
import { SignInForm } from "../../components/auth/sign-in-form";
import { AuthToggle } from "../../components/auth/toggle";

export const Route = createFileRoute("/auth/sign-in")({
  component: SignIn,
});

function SignIn() {
  return (
    <>
      <PageTitle title="Вход" />
      <AuthLayout
        title="С возвращением!"
        subtitle="Войдите в аккаунт для доступа к своей рабочей области"
      >
        <SignInForm />
        <AuthToggle
          message="Нет учетной записи?"
          linkText="Создать учетную запись"
          linkTo="/auth/sign-up"
        />
      </AuthLayout>
    </>
  );
}
