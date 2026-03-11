import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-8">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: March 11, 2026</p>

          <div className="prose prose-sm max-w-none space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">Welcome</h2>
              <p>Welcome to our platform. We respect your privacy and are committed to protecting your personal information.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">Information We Collect</h2>
              <p>When you use our website or services, we may collect certain information such as your name, email address, and other details necessary to provide our services. This information is used only to improve our services and provide a better user experience.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">Data Sharing</h2>
              <p>We do not sell, trade, or share your personal information with third parties except when required to provide our services or when required by law.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">Payments</h2>
              <p>Payments on this platform are processed securely through trusted payment partners. We do not store your payment card details on our servers.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">Data Security</h2>
              <p>We implement reasonable security measures to protect your data from unauthorized access, alteration, or disclosure.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">Agreement</h2>
              <p>By using our website, you agree to the terms of this privacy policy.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">Contact Us</h2>
              <p>If you have any questions regarding this policy, you can contact us through the <a href="/contact" className="text-primary hover:underline">contact page</a> on our website.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
