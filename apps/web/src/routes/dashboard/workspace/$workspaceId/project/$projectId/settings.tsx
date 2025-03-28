import PageTitle from "@/components/page-title";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import icons from "@/constants/project-icons";
import useDeleteProject from "@/hooks/mutations/project/use-delete-project";
import useUpdateProject from "@/hooks/mutations/project/use-update-project";
import { cn } from "@/lib/cn";
import useProjectStore from "@/store/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const projectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  slug: z.string().min(1, "Project slug is required"),
  icon: z.string().min(1, "Project icon is required"),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export const Route = createFileRoute(
  "/dashboard/workspace/$workspaceId/project/$projectId/settings",
)({
  component: ProjectSettings,
});

function ProjectSettings() {
  const { project, setProject } = useProjectStore();
  const [confirmProjectName, setConfirmProjectName] = useState("");
  const { mutateAsync: updateProject, isPending } = useUpdateProject();
  const { mutateAsync: deleteProject, isPending: isDeleting } =
    useDeleteProject();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: project?.name ?? "",
      slug: project?.slug ?? "",
      icon: project?.icon ?? "Layout",
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      await updateProject({
        id: project?.id ?? "",
        workspaceId: project?.workspaceId ?? "",
        description: project?.description ?? "",
        name: data.name,
        icon: data.icon,
        slug: data.slug,
      });

      queryClient.invalidateQueries({
        queryKey: ["project", project?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", project?.workspaceId],
      });

      toast.success("Проект успешно обновлен");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось обновить проект",
      );
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;

    if (confirmProjectName !== project.name) {
      toast.error("Имя проекта не совпадает");
      return;
    }

    try {
      await deleteProject({ id: project.id });

      queryClient.invalidateQueries({
        queryKey: ["project", project.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", project.workspaceId],
      });

      setProject(undefined);
      navigate({
        to: "/dashboard/workspace/$workspaceId",
        params: {
          workspaceId: project.workspaceId,
        },
      });

      toast.success("Проект успешно удален");
      setConfirmProjectName("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось удалить проект",
      );
    }
  };

  return (
    <>
      <PageTitle title="Настройки проекта" />
      <div className="h-full flex flex-col bg-white dark:bg-zinc-900 overflow-hidden">
        <header className="sticky top-0 z-10 flex items-center px-4 h-[65px] bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Настройки проекта
            </h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <div className="p-4 md:p-6">
                <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                  Основные настройки
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                  Основная информация и настройки проекта.
                </p>

                {project ? (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Имя проекта</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="bg-white dark:bg-zinc-800/50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="slug"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Аббревиатура проекта</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="bg-white dark:bg-zinc-800/50 font-mono"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="icon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Иконка проекта</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-[240px] overflow-y-auto p-2 rounded-lg border border-zinc-200 dark:border-zinc-700/50">
                                  {Object.entries(icons).map(([name, Icon]) => (
                                    <button
                                      key={name}
                                      type="button"
                                      onClick={() => field.onChange(name)}
                                      className={cn(
                                        "p-3 sm:p-2 rounded-lg transition-colors flex items-center justify-center group",
                                        field.value === name
                                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                                      )}
                                      title={name}
                                    >
                                      <Icon className="w-6 h-6 sm:w-5 sm:h-5" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={isPending}>
                        {isPending ? "Сохраняем..." : "Сохранить изменения"}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    Выберите проект для просмотра его настроек
                  </div>
                )}
              </div>
            </div>

            {project && (
              <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="p-4 md:p-6">
                  <h2 className="text-base font-medium text-red-600 dark:text-red-400 mb-1">
                    Опасная зона
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                    Здесь можно удалить проект. Это действие нельзя отменить.
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 bg-red-500/5 border border-red-200 dark:border-red-500/10 rounded-lg">
                      <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-3">
                        <AlertTriangle className="w-5 h-5" />
                        <p className="font-medium">
                          Внимание: это действие нельзя отменить
                        </p>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-600/90 dark:text-red-400/90">
                        <li>Все задачи будут удалены</li>
                        <li>Вся история задач будет удалена</li>
                        <li>Настройки проекта будут удалены</li>
                      </ul>
                    </div>

                    <div>
                      <label
                        htmlFor="confirm-project-name"
                        className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1.5"
                      >
                        Введите "{project.name}" для подтверждения удаления
                      </label>
                      <div className="flex gap-3">
                        <Input
                          value={confirmProjectName}
                          onChange={(e) =>
                            setConfirmProjectName(e.target.value)
                          }
                          placeholder={project.name}
                          className="bg-white dark:bg-zinc-800/50"
                        />
                        <Button
                          onClick={handleDeleteProject}
                          disabled={confirmProjectName !== project.name}
                          className="bg-red-600 text-white hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-400 disabled:opacity-50"
                        >
                          {isDeleting ? "Удаляем..." : "Удалить проект"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
