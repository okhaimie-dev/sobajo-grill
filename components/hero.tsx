export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="container hero-content">
        <div className="eyebrow">Baltimore Suya Delicacies</div>
        <h1>
          Fire. Flavor. <span>Friendship.</span>
        </h1>
        <p>
          Baltimore Suya Delicacies rooted in Friendship • Heritage • Flavor •
          Community.
        </p>
        <div className="actions">
          <a className="btn red" href="#menu">
            Start Your Order
          </a>
          <a className="btn gold" href="#delivery">
            Schedule Delivery
          </a>
          <a className="btn dark" href="#catering">
            Book Catering
          </a>
          <a className="btn dark" href="#shipping">
            Nationwide Shipping
          </a>
        </div>
      </div>
    </header>
  );
}
