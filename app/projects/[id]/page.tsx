"use client";


import ProjectCard from "../../components/feed/ProjectCard";

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  // fetch project data via id, using dummy for now
  const project = { id, title: "Sample Project", description: "Detailed description...", tags: "AI,Web3", owner: { name: "Owner" } };

  return (
    <div className="min-h-screen bg-white text-black px-6 pt-24 pb-32">
      <div className="max-w-3xl mx-auto">
        <ProjectCard project={project} />
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-3">Project Overview</h2>
          <p>{project.description}</p>
          <h3 className="text-xl font-semibold mt-6">Required Skills</h3>
          <p>React, Node, AI</p>
          <h3 className="text-xl font-semibold mt-6">Team Members</h3>
          <p>John, Jane, ...</p>
          <h3 className="text-xl font-semibold mt-6">Timeline</h3>
          <p>3 months</p>
          <button className="mt-8 px-8 py-4 bg-black text-white rounded-lg">Apply to Join Project</button>
        </div>
      </div>
    </div>
  );
}