import { useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import ProjectImage from "./ProjectImage";
import ProjectItem from "./ProjectItem";

export interface Project {
  title: string;
  description: string;
  url?: string;
  image?: string;
}

interface ProjectListProps {
  projects: Project[];
}

const ProjectList = ({ projects }: ProjectListProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const projectsPerPage = 5;
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const startIndex = currentPage * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentPageProjects = projects.slice(startIndex, endIndex);

  const currentProject = hoveredIndex !== null ? currentPageProjects[hoveredIndex] : null;
  const currentMobileProject = projects[currentMobileIndex];

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0 && currentMobileIndex < projects.length - 1) {
        // Swipe left - next project
        setCurrentMobileIndex(currentMobileIndex + 1);
      } else if (swipeDistance < 0 && currentMobileIndex > 0) {
        // Swipe right - previous project
        setCurrentMobileIndex(currentMobileIndex - 1);
      }
    }
  };

  return (
    <>
      {/* Desktop view */}
      <div className="hidden sm:block h-full relative">
        <div className="flex gap-16 h-full">
          <div className="flex-1 max-w-md flex flex-col">
            <div className="min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.ul
                  key={currentPage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="relative space-y-1 group/list"
                  onMouseLeave={handleMouseLeave}
                >
                  {currentPageProjects.map((project, index) => (
                    <ProjectItem
                      key={project.title}
                      ref={(el) => {
                        itemRefs.current[index] = el;
                      }}
                      project={project}
                      onMouseEnter={() => handleMouseEnter(index)}
                    />
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>

            {/* Pagination numbers - Desktop - Fixed position */}
            {totalPages > 1 && (
              <div className="flex items-center gap-3 text-sm mt-16">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`transition-all duration-300 inline-block ${
                      index === currentPage
                        ? "text-foreground"
                        : "text-[#3C82F7] underline decoration-[rgba(60,130,247,0.3)] underline-offset-2 hover:decoration-[#3C82F7] skew-x-[-8deg] hover:skew-x-0"
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {currentProject?.image && (
                <ProjectImage
                  key={currentProject.title}
                  src={currentProject.image}
                  alt={currentProject.title}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile view - carousel */}
      <div className="sm:hidden pt-14 relative min-h-[500px]">
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMobileIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {currentMobileProject.image && (
                <div className="w-full rounded-lg overflow-hidden">
                  <img
                    src={currentMobileProject.image}
                    alt={currentMobileProject.title}
                    className="w-full h-auto"
                    draggable="false"
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Fixed position text */}
          <div className="absolute bottom-16 left-0 right-0 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMobileIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <a
                  href={currentMobileProject.url || "#"}
                  target={currentMobileProject.url?.startsWith("http") ? "_blank" : undefined}
                  rel={currentMobileProject.url?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="block space-y-1"
                >
                  <h3 className="font-medium text-[#3C82F7] text-base">
                    {currentMobileProject.title}
                  </h3>
                  <p className="text-muted text-sm">
                    {currentMobileProject.description}
                  </p>
                </a>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination dots for mobile */}
          <div className="flex items-center justify-center gap-2 absolute bottom-6 left-0 right-0">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentMobileIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentMobileIndex
                    ? "bg-foreground w-8"
                    : "bg-muted w-1.5"
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectList;
