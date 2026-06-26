import { useState, useEffect } from 'react'
import type { ProjectData } from '../../data/portfolio'
import './ProjectShowcase.css'

interface ProjectShowcaseProps {
  project: ProjectData
  isVisible: boolean
}

export function ProjectShowcase({ project, isVisible }: ProjectShowcaseProps) {
  const [imageIndex, setImageIndex] = useState(0)

  const images = [project.imagePath] // Extend with more images if available

  useEffect(() => {
    if (!isVisible) {
      setImageIndex(0)
    }
  }, [isVisible])

  const currentImage = images[imageIndex] || project.imagePath

  const handleNextImage = () => {
    setImageIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrevImage = () => {
    setImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (!isVisible) return null

  return (
    <div className="project-showcase">
      <div className="project-showcase__container">
        {/* Main image display */}
        <div className="project-showcase__main">
          <img
            src={currentImage}
            alt={project.title}
            className="project-showcase__image"
          />
          
          {/* Image carousel indicators */}
          {images.length > 1 && (
            <div className="project-showcase__carousel">
              <button
                className="project-showcase__carousel-btn project-showcase__carousel-btn--prev"
                onClick={handlePrevImage}
                aria-label="Previous image"
              >
                ←
              </button>
              <div className="project-showcase__indicators">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    className={`project-showcase__indicator ${idx === imageIndex ? 'project-showcase__indicator--active' : ''}`}
                    onClick={() => setImageIndex(idx)}
                    aria-label={`Image ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                className="project-showcase__carousel-btn project-showcase__carousel-btn--next"
                onClick={handleNextImage}
                aria-label="Next image"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Project info panel */}
        <div className="project-showcase__info">
          <div className="project-showcase__header">
            <h2 className="project-showcase__title">{project.title}</h2>
            <span className="project-showcase__badge">Featured</span>
          </div>

          <p className="project-showcase__description">{project.description}</p>

          {/* Tech stack */}
          {project.tech && project.tech.length > 0 && (
            <div className="project-showcase__tech">
              <p className="project-showcase__tech-label">Tech Stack</p>
              <div className="project-showcase__tech-tags">
                {project.tech.map((tech: string) => (
                  <span key={tech} className="project-showcase__tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="project-showcase__links">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-showcase__link">
                GitHub
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="project-showcase__link project-showcase__link--primary">
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
