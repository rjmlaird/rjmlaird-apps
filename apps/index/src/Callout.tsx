import type { FC } from "hono/jsx";

export interface CalloutProps {
  labsHref?: string;
  toolsHref?: string;
}

const CARDS = [
  {
    key: "labs",
    icon: "L",
    label: "Labs",
    title: "Experiments and prototypes",
    text: "Working experiments, research prototypes and interactive explorations across science, data, design and the web.",
    cta: "Explore labs",
  },
  {
    key: "tools",
    icon: "T",
    label: "Tools",
    title: "Focused utilities",
    text: "Smaller, task-specific utilities, calculators and templates designed to make a particular job quicker, clearer or easier.",
    cta: "Explore tools",
  },
] as const;

// Styles live in ./callout-styles and are appended to the page CSS string.
// The heading id is fixed, so render at most one Callout per page.
export const Callout: FC<CalloutProps> = ({
  labsHref = "https://labs.rjmlaird.co.uk/",
  toolsHref = "https://tools.rjmlaird.co.uk/",
}) => {
  const hrefs = {
    labs: labsHref,
    tools: toolsHref,
  };

  return (
    <section class="labs-tools" aria-labelledby="labs-tools-title">
      <div class="labs-tools__intro">
        <p class="labs-tools__eyebrow">Digital projects</p>
        <h2 id="labs-tools-title">Labs and tools</h2>
        <p>
          Explore working experiments and prototypes alongside focused utilities for
          useful tasks, clearer information and better decisions.
        </p>
      </div>

      <ul class="labs-tools__grid" role="list">
        {CARDS.map((card) => (
          <li class={`project-card project-card--${card.key}`}>
            <div class="project-card__icon" aria-hidden="true">
              {card.icon}
            </div>

            <div>
              <p class="project-card__label">{card.label}</p>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
            <a class="project-card__link" href={hrefs[card.key]}>
              {card.cta} <span aria-hidden="true">→</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Callout;
