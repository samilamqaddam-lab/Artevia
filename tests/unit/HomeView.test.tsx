import {render, screen} from '@testing-library/react';
import {HomeView} from '@/components/home/HomeView';

describe('HomeView', () => {
  it('renders headline and CTA', () => {
    render(
      <HomeView
        locale="fr"
        tagline="Tagline"
        headline="Titre principal"
        subtitle="Sous-titre"
        ctaPrimary="Créer"
        ctaSecondary="Catalogue"
        pillars={[
          {title: 'Feature', description: 'Description'}
        ]}
        workflowTitle="Process"
        workflowSteps={[{title: 'Étape 1', description: 'Description'}]}
        featuredProductSlug="tshirt-classique"
      />
    );

    expect(screen.getByText('Titre principal')).toBeInTheDocument();
    expect(screen.getByText('Catalogue')).toBeInTheDocument();
    expect(screen.getByText('Process')).toBeInTheDocument();
  });
});
