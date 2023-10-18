import { Link } from 'react-router-dom';


const About = () => {
  return (
    <div data-testid="About">
      <div className="container mt-2">
        <h1>About</h1>
        <p> Assalamualaikum 👋, we hope you're reading this with the best of health and iman. This website provides up to date salah and jummah times for the Southcourt and Havelock Street Masjid. Whenever the masjids changes the salah times the website is updated automatically.</p>
        <p> Please share this website with other residents in Aylesbury so they can benefit as well Insha’Allah. If you find any issue with the site submit the short form <Link to="contact-us">here</Link>.</p>
        <p>You can visit the southcourt mosque website <a href="https://southcourtislamiccentre.com/">here</a></p>
      </div>
    </div>
  );
};

export default About;
