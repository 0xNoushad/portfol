import { forwardRef } from "react";

export interface Project {
  title: string;
  description: string;
  url?: string;
  image?: string;
}

interface ProjectItemProps {
  project: Project;
  onMouseEnter: () => void;
}

const ProjectItem = forwardRef<HTMLLIElement, ProjectItemProps>(
  ({ project, onMouseEnter }, ref) => {
    const hasExternalUrl = project.url && project.url.startsWith("http");

    return (
      <li ref={ref} className="relative -ml-4 group transition-opacity duration-300 group-hover/list:opacity-50 hover:!opacity-100" onMouseEnter={onMouseEnter}>
        <a
          href={project.url || "#"}
          target={hasExternalUrl ? "_blank" : undefined}
          rel={hasExternalUrl ? "noopener noreferrer" : undefined}
          className="relative block pl-4 py-3 pr-4"
          aria-label={`View ${project.title} project${hasExternalUrl ? " (opens in new tab)" : ""}`}
        >
          <h3 className="font-medium text-foreground group-hover:text-[#3C82F7] transition-all duration-300 group-hover:skew-x-[-8deg]">
            {project.title}
          </h3>
          <p className="text-muted text-sm mt-1 group-hover:text-foreground transition-colors">{project.description}</p>
        </a>
      </li>
    );
  }
);

ProjectItem.displayName = "ProjectItem";

export default ProjectItem;
