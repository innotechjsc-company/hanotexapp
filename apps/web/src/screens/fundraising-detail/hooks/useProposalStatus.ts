import { useEffect, useState } from "react";
import { projectProposeApi } from "@/api/project-propose";
import { ProjectProposeStatus } from "@/types/project-propose";

export function useProposalStatus(projectId: string, userId?: string) {
  const [hasExistingProposal, setHasExistingProposal] = useState(false);

  useEffect(() => {
    const checkExistingProposal = async () => {
      try {
        if (!projectId || !userId) return;
        const res = await projectProposeApi.list(
          { project: String(projectId), user: String(userId) },
          { limit: 10, sort: "-createdAt" }
        );
        const proposals = (
          Array.isArray(res.docs)
            ? res.docs
            : Array.isArray(res.data)
              ? res.data
              : []
        ) as any[];
        const hasRelevant = proposals.some(
          (p) =>
            p?.status !== ProjectProposeStatus.Negotiating &&
            p?.status !== ProjectProposeStatus.Cancelled &&
            p?.status !== ProjectProposeStatus.ContractSigned
        );
        setHasExistingProposal(hasRelevant);
      } catch (err) {
        console.warn("Could not verify existing proposal:", err);
      }
    };
    checkExistingProposal();
  }, [projectId, userId]);

  return { hasExistingProposal, setHasExistingProposal };
}
