import { useEffect, useState } from "react";
import { getProjectById } from "@/api/projects";
import type { Project } from "@/types/project";

export function useFundraisingProject(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) {
        setError("ID dự án không hợp lệ");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        // Fetch project details
        const projectData = await getProjectById(projectId);

        // Check if projectData is valid
        if (!projectData) {
          throw new Error("Không tìm thấy dự án");
        }

        setProject(projectData);

        // Fetch investment fund if exists
        if (
          projectData &&
          projectData.investment_fund &&
          Array.isArray(projectData.investment_fund) &&
          projectData.investment_fund.length > 0
        ) {
          // Note: Investment fund data is already populated in project.investment_fund
          // No need to fetch separately - data is available in projectData.investment_fund array
        }
      } catch (err: any) {
        console.error("Error fetching project details:", err);
        setError(err.message || "Có lỗi xảy ra khi tải thông tin dự án");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  return { project, isLoading, error };
}
