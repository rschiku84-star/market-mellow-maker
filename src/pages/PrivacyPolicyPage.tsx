import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-8">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: March 9, 2026</p>

          <div className="prose prose-sm max-w-none space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">1. Introduction</h2>
              <p>CreatorHub ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">2. Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong className="text-foreground">Account Information:</strong> Name, email address, and password when you create an account.</li>
                <li><strong className="text-foreground">Content:</strong> Product images, descriptions, and videos you upload or generate.</li>
                <li><strong className="text-foreground">Usage Data:</strong> How you interact with our platform, including pages visited and features used.</li>
                <li><strong className="text-foreground">Payment Information:</strong> Billing details processed securely through our payment provider (Stripe).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>To provide and maintain our services.</li>
                <li>To process transactions and manage subscriptions.</li>
                <li>To generate AI-powered content on your behalf.</li>
                <li>To communicate updates, promotions, and support.</li>
                <li>To improve our platform and develop new features.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">4. Data Sharing</h2>
              <p>We do not sell your personal information. We may share data with trusted third-party services (e.g., payment processors, cloud hosting) solely to operate and improve our platform.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">5. Data Security</h2>
              <p>We implement industry-standard security measures to protect your data. However, no method of electronic transmission or storage is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">6. Your Rights</h2>
              <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at <a href="mailto:support@creatorhub.com" className="text-primary hover:underline">support@creatorhub.com</a>.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">7. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:support@creatorhub.com" className="text-primary hover:underline">support@creatorhub.com</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
