import React from 'react';
import {
  FaBrain,
  FaChartBar,
  FaCode,
  FaGithub,
  FaPalette,
  FaRobot,
  FaServer,
} from 'react-icons/fa';
import UrbanDrawingApp from '../components/UrbanDrawingApp';

const UrbanDrawingProject: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 pb-20 pt-20 dark:from-secondary-900 dark:via-secondary-900 dark:to-secondary-800">
    <section className="mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-24">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary-600 dark:text-primary-400">
            Computer vision · Participatory urbanism
          </p>
          <h1 className="mt-4 max-w-xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-secondary-950 dark:text-white sm:text-5xl">
            What do children place in their imagined city?
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-secondary-600 dark:text-secondary-300">
            UrbanDraw AI turns children’s drawings into an exploratory map of
            people, nature, play, built form, spatial emphasis, and color.
          </p>

          <div className="mt-7 border-l-2 border-primary-300 pl-5 dark:border-primary-700">
            <p className="text-sm leading-6 text-secondary-600 dark:text-secondary-400">
              The live prototype routes first to a managed Roboflow workflow and
              automatically switches to an independently hosted Hugging Face
              model when the primary service is unavailable.
            </p>
          </div>

          <div className="mt-8 grid max-w-lg grid-cols-3 gap-2">
            {[
              ['01', 'Objects', 'Four thematic groups'],
              ['02', 'Space', 'Nine drawing zones'],
              ['03', 'Color', 'Paper-calibrated HSV'],
            ].map(([number, label, detail]) => (
              <div
                key={number}
                className="rounded-xl border border-secondary-200 bg-white/75 p-3 dark:border-secondary-700 dark:bg-secondary-800/70"
              >
                <p className="font-mono text-[10px] text-primary-600 dark:text-primary-400">
                  {number}
                </p>
                <p className="mt-2 text-sm font-semibold text-secondary-900 dark:text-white">
                  {label}
                </p>
                <p className="mt-1 text-[11px] leading-4 text-secondary-500 dark:text-secondary-400">
                  {detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://github.com/saeedmakaremi/UrbanDrawAI"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline gap-2 bg-white/70 dark:bg-secondary-900/60"
            >
              <FaGithub /> View model repository
            </a>
            <a
              href="https://huggingface.co/spaces/sdmac/Urban-Draw-Detection"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary gap-2"
            >
              <FaServer /> Open reserve Space
            </a>
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-secondary-200 bg-white p-4 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.35)] dark:border-secondary-700 dark:bg-secondary-800 sm:p-6">
          <UrbanDrawingApp />
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-10 border-t border-secondary-200 pt-12 dark:border-secondary-700 md:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">
            Research context
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-secondary-950 dark:text-white">
            Drawing as evidence for conversation
          </h2>
        </div>
        <div className="space-y-5 text-[15px] leading-7 text-secondary-600 dark:text-secondary-300">
          <p>
            This project explores a scalable way to bring children’s visual
            accounts of public space into participatory urban research. A custom
            detector groups marked elements into Person, Built Environment,
            Environmental, and Recreational categories, then summarizes their
            location and color.
          </p>
          <p>
            Interpretations are deliberately drawing-level and exploratory.
            They can support follow-up questions about social life, nature,
            play, and structure, but they are not clinical or personality
            assessments. Drawing instructions, age, culture, materials,
            imagination, and detector error remain important alternative
            explanations.
          </p>
          <p>
            The associated article is co-authored with Borhan Sepehri, Marjan
            Mehrmanesh, and Soran Mansournia. Publication details and DOI will
            be added when available.
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          [FaRobot, 'Custom detection', 'Four research-specific thematic categories'],
          [FaBrain, 'Grounded interpretation', 'Observation before cautious inference'],
          [FaPalette, 'Calibrated color', 'Paper-aware analysis of marked pixels'],
          [FaChartBar, 'Structured evidence', 'Counts, positions, proportions, and palette'],
          [FaCode, 'React interface', 'Responsive and keyboard-accessible exploration'],
          [FaServer, 'Dual deployment', 'Managed primary with an independent reserve'],
        ].map(([Icon, title, description]) => {
          const FeatureIcon = Icon as React.ComponentType<{ className?: string }>;
          return (
            <div
              key={String(title)}
              className="rounded-xl border border-secondary-200 bg-white p-4 dark:border-secondary-700 dark:bg-secondary-800"
            >
              <FeatureIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              <p className="mt-3 text-sm font-semibold text-secondary-900 dark:text-white">
                {String(title)}
              </p>
              <p className="mt-1 text-xs leading-5 text-secondary-500 dark:text-secondary-400">
                {String(description)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  </div>
);

export default UrbanDrawingProject;
