import React from "react";
// import 'loader.js';
import $ from 'jquery';
import "./css/bootstrap.min.css";
import "./css/materialdesignicons.min.css";
import "./css/owl.carousel.css";
// import "./css/owl.theme.css";
// import "./css/owl.transitions.min.css";
import "./css/magnific-popup.css";
import "./css/swiper.min.css";
import "./css/owl.transitions.css";
import './css/style.css'
import axios from 'axios';
import { API_URL } from '../../utils/urls'
// import "./index.scss";
var __html = require('../../home/index.html.js');
var template = { __html: __html };

function Home() {
    const [state, setState] = React.useState({
        name: "",
        surname: "",
        email: "",
        topic: "",
        description: "",
        hasError: ""
    })

    const _handleChangeValue = e => {
        const { name, value } = e.target;
        setState({
            ...state,
            [name]: [value]
        })
    }

    const _handleSendMail = () => {
        const { name, surname, email, topic, description } = state;
        if (name === "" || surname === "" || email === "" || topic === "" || description === "") {
            setState({
                ...state,
                hasError: "Pola nie mogą być puste."
            })
        }
        const data = {
            name, surname, email, topic, description
        }
        axios.post(`${API_URL}/api/contact/contact-to-us`, data).then((response) => {
            alert("Email został wysłany")
            setState({
                ...state,
                name: "",
                email: "",
                surname: "",
                topic: "",
                description: ""
            })
        }, (err) => {
            console.log("Axios error: " + err)
        })

    }


    const _renderContent = () => {
        return (
            <React.Fragment>
                <nav className="navbar navbar-expand-lg fixed-top navbar-custom sticky sticky-dark">
                    <div className="container">
                        <a className="navbar-brand logo text-uppercase" href="/search">
                            <img src="images/1.png" className="logo-light" alt="" height="90" />
                            <img src="images/1.png" className="logo-dark" alt="" height="60" />
                        </a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                            aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                            <i className="mdi mdi-menu"></i>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarCollapse">
                            <ul className="navbar-nav ml-auto navbar-center" id="mySidenav">
                                <li className="nav-item active">
                                    <a href="#home" className="nav-link">Home</a>
                                </li>
                                <li className="nav-item">
                                    <a href="#services" className="nav-link">Funkcjonalności</a>
                                </li>
                                <li className="nav-item">
                                    <a href="#pricing" className="nav-link">Cennik</a>
                                </li>
                                <li className="nav-item">
                                    <a href="#contact" className="nav-link">Kontakt</a>
                                </li>
                            </ul>

                            <div className="navbar-button">
                                <a href="/search" className="btn btn-sm btn-custom btn-round">Spróbuj za darmo</a>
                            </div>
                        </div>
                    </div>
                </nav>
                <section className="bg-home-1" id="home">
                    <div className="home-bg-overlay"></div>
                    <div className="home-center">
                        <div className="home-desc-center">
                            <div className="container">
                                <div className="row vertical-content">
                                    <div className="col-lg-6">
                                        <div className="home-content">
                                            <h3 className="home-title">Automatycznie wyceniamy cenę transportu, szybko i precyzyjnie
                                </h3>
                                            <p className="home-desc line-height_1_8 mt-4 text-white-50">Nowoczesne narzędzie
                                    umożliwiające łatwe i szybkie porównanie ofert firm z branży transportowej</p>
                                            <div className="mt-5">
                                                <a href="/search" className="btn btn-white btn-round">Wyceń fracht<i
                                                    className="mdi mdi-arrow-right"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="home-img mt-4">
                                            <img src="images/features/img-1.png" className="img-fluid" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="container-fluid">
                                <div className="row">
                                    <div className="home-shape mt-4">
                                        <img src="images/shape-1.png" alt="" className="img-fluid mx-auto d-block" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
                <section className="section bg-light" id="services">
                    <div className="container">
                        <div className="row vertical-content">
                            <div className="col-lg-4">
                                <div className="mt-4">
                                    <h4 className="services-title line-height_1_4">Nasze funkcjonalności</h4>
                                    <p className="text-muted mt-3 line-height_1_8 f-15">Łączymy przewoźników z załadowcami, chcącymi
                            przewieźć ładunek</p>
                                    <div className="mt-5">
                                        <a href="https://www.facebook.com/LogiCalc-106321854209260" className="btn btn-custom btn-round">Dowiedz się więcej<i
                                            className="mdi mdi-arrow-right"></i></a>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="services-box bg-white p-5 btn-round mt-4">
                                    <div className="services-icon">
                                        <img src="images/icon/time-saving.svg" className="img-fluid" alt="" />
                                    </div>
                                    <h5 className="mt-4 pt-2">Oszczędność czasu</h5>
                                    <p className="text-muted mt-4 mb-0">Nasze narzędzie skraca czas poszukiwania najlepszego przewoźnika
                            aż o 80%</p>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="services-box bg-white p-5 btn-round mt-4">
                                    <div className="services-icon">
                                        <img src="images/icon/compass.svg" className="img-fluid" alt="" />
                                    </div>
                                    <h5 className="mt-4 pt-2">Duża precyzja</h5>
                                    <p className="text-muted mt-4 mb-0">Wyliczamy cenę transportu, odstającą tylko +/- 5% od
                                        rzeczywistej ceny frachtu
                        </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
                <section className="section" id="features">
                    <div className="container">
                        <div className="row vertical-content">
                            <div className="col-lg-6">
                                <div className="features-img mt-4">
                                    <img src="images/features/img-2.png" className="img-fluid" alt="" />
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="features-content mt-4">
                                    <h4 className="title-heading line-height_1_4">Pomagamy przewoźnikom zyskać dodatkowe źródło klientów
                        </h4>
                                    <p className="text-muted mt-4">Duża konkurencja na rynku TSL spowodowała że próg wejścia dla
                                        mniejszych firm jest bardzo duży, nasze narzędzie nie faworyzuje żadnego przewoźnika, szuka
                            najlepszej oferty.</p>
                                    <p className="text-muted mt-4">Korzyścią dla nadawcy jest szybka wycena ofert organizacji
                            logistycznych i możliwość szybkiego kontaktu z wybraną firmą.</p>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="container" style={{marginTop: "5rem"}}>
                        <div className="row vertical-content">
                            <div className="col-lg-12">
                                <h3 className="text-center">Jak szukać przewoźników przy użyciu naszego narzędzia ?</h3>
                            </div>
                            <div className="col-lg-9 embed-responsive embed-responsive-16by9" style={{marginTop: "2rem"}}>
                                <iframe src="https://www.youtube.com/embed/UoY7V5vmjMw" frameborder="0" allowfullscreen></iframe>
                            </div>
                        </div>
                    </div>
                </section>
                {/* <section className="section counter">
                    <div className="container">

                        <div className="row">
                            <div className="col-lg-12">
                                <h1 className="title-heading text-center">Build your dream website today</h1>
                                <p className="title-desc text-center text-white-50 mt-4">Call to action pricing table is really crucial
                        to your for your business website. Make your bids stand-out with amazing options.</p>
                            </div>
                        </div>

                        <div className="row mt-5" id="counter">
                            <div className="col-lg-3">
                                <div className="counter-box text-center mt-5">
                                    <div className="counter-icon">
                                        <i className="mdi mdi-check-circle-outline"></i>
                                    </div>
                                    <h2 className="counter-count mt-3"> <span className="counter-value" data-count="100">56</span>K</h2>
                                    <p className="mt-3 text-white-50 mb-0">App Download</p>
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="counter-box text-center mt-5">
                                    <div className="counter-icon">
                                        <i className="mdi mdi-forum-outline"></i>
                                    </div>
                                    <h2 className="counter-count mt-3"> <span className="counter-value" data-count="2679">1255</span></h2>
                                    <p className="mt-3 text-white-50 mb-0">Feedback</p>
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="counter-box text-center mt-5">
                                    <div className="counter-icon">
                                        <i className="mdi mdi-star-outline"></i>
                                    </div>
                                    <h2 className="counter-count mt-3"> <span className="counter-value" data-count="4.80">2.68</span>%</h2>
                                    <p className="mt-3 text-white-50 mb-0">Users Rating</p>
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="counter-box text-center mt-5">
                                    <div className="counter-icon">
                                        <i className="mdi mdi-heart-outline"></i>
                                    </div>
                                    <h2 className="counter-count mt-3"> <span className="counter-value" data-count="5000">2000</span>+</h2>
                                    <p className="mt-3 text-white-50 mb-0">Happy User</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </section> */}
                <section className="section bg-light" id="pricing">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <h1 className="title-heading text-center">Cennik</h1>
                                <p className="title-desc text-center text-muted mt-4">Cennik został tak zaprojektowany, aby osoby chcące
                        znaleźć przewoźnika, nie musiałby płacić za publikację oferty transportu</p>
                            </div>
                        </div>

                        <div className="row mt-4">

                            <div className="col-lg-4 offset-lg-2">
                                <div className="pricing-box text-center bg-white p-5 mt-5">
                                    <h4 className="pricing-plan text-uppercase">Dla załadowcy</h4>
                                    <h2 className="pricing-price mt-5 mb-0">Darmowy</h2>
                                    <p className="pricing-month mt-1">----</p>
                                    <div className="plan-features mt-5">
                                        <p><b>Darmowe</b> wyszukiwanie ofert</p>
                                        <p><b>Nieograniczone</b> wyszukiwanie ofert</p>
                                        <p><b>Nieograniczona</b> liczba zgłoszeń</p>
                                        <p><b>Nie</b> wymaga posiadania konta</p>
                                        <p><b>Nie</b> wymaga potwierdzenia firmy</p>
                                    </div>
                                    <div className="mt-5">
                                        <a href="/search" className="btn btn-secondary btn-sm btn-round">Sprawdź już teraz</a>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="pricing-box-active text-center bg-white p-5 mt-5">
                                    <h4 className="pricing-plan text-uppercase">Dla przewoźnika/spedycji</h4>
                                    <h2 className="pricing-price mt-5 mb-0">50PLN/1 pojazd</h2>
                                    <p className="pricing-month mt-1">za miesiąc</p>
                                    <div className="plan-features mt-5">
                                        <p><b>Brak</b> ukrytych opłat</p>
                                        <p><b>Brak</b> prowizji od zleceń</p>
                                        <p><b>Własny</b> branding (logo, nazwa firmy)</p>
                                    </div>
                                    <div className="mt-5">
                                        <a href="https://www.facebook.com/LogiCalc-106321854209260" className="btn btn-custom btn-sm btn-round">Dołącz do nas</a>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
                {/* <section className="section bg-client" id="clients">
                    <div className="container">

                        <div className="row">
                            <div className="col-lg-12">
                                <h1 className="title-heading text-center">What they've said</h1>
                                <p className="title-desc text-center text-muted mt-4">In an ideal world this website wouldn’t exist, a
                        client would acknowledge the importance of having web copy before the design starts.</p>
                            </div>
                        </div>

                        <div className="row mt-5 justify-content-center">
                            <div className="col-lg-8">
                                <div id="owl-demo">

                                    <div className="client-content text-center mt-4">
                                        <div className="clinet-img">
                                            <img src="images/users/img-1.jpg" className="img-fluid rounded-circle" alt="" />
                                        </div>
                                        <h5 className="mt-4">Raymond Sloan</h5>
                                        <p className="f-12">Web Developer</p>
                                        <p className="f-16 client-desc">"Aenean vehicula neque turpis at dictum purus malesuada Aenean
                                risus ex sollicitudin nec pharetra in cursus aliquet."</p>
                                    </div>

                                    <div className="client-content text-center mt-4">
                                        <div className="clinet-img">
                                            <img src="images/users/img-2.jpg" className="img-fluid rounded-circle" alt="" />
                                        </div>
                                        <h5 className="mt-4">Mary Shriner</h5>
                                        <p className="f-12">Web Designer</p>
                                        <p className="f-16 client-desc">"Aenean vehicula neque turpis at dictum purus malesuada Aenean
                                risus ex sollicitudin nec pharetra in cursus aliquet."</p>
                                    </div>

                                    <div className="client-content text-center mt-4">
                                        <div className="clinet-img">
                                            <img src="images/users/img-3.jpg" className="img-fluid rounded-circle" alt="" />
                                        </div>
                                        <h5 className="mt-4">Robert Garrett</h5>
                                        <p className="f-12">Web Developer</p>
                                        <p className="f-16 client-desc">"Aenean vehicula neque turpis at dictum purus malesuada Aenean
                                risus ex sollicitudin nec pharetra in cursus aliquet."</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}
                <section className="section" id="contact">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <h1 className="title-heading text-center">Kontakt do nas</h1>
                                <p className="title-desc text-center text-muted mt-4">
                                    Jeśli chciałbyś się zarejestrować jako przewoźnik lub jeśli masz jakieś pytania odnośnie
                                    prowadzonej przez nas działalności, to zapraszamy do kontaktu.
                    </p>
                            </div>
                        </div>

                        <div className="row justify-content-center mt-5">
                            {_renderMailForm()}
                        </div>
                    </div>
                </section>
                <section className="footer">
                    <div className="footer-bg-overlay"></div>
                    <div className="container">
                        <div className="row footer-content">
                            <div className="col-lg-4">
                                <img src="images/favico.png" alt="" height="80" />
                            </div>
                            <div className="col-lg-8">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="col-lg-4">
                                            <h5 className="f-18 text-white">Kontakt</h5>
                                            <ul className="list-unstyled footer-link mt-3">
                                                <li>(+48) 608 624 531</li>
                                                <li>admin@teachtechservice.com</li>
                                            </ul>
                                        </div>
                                        <div className="col-lg-6">
                                            <h5 className="f-18 text-white">Dane firmy</h5>
                                            <ul className="list-unstyled footer-link mt-3">
                                                <li>Teach Tech Service Marcin Warzybok</li>
                                                <li>NIP: 6793184304</li>
                                                <li>REGON: 383274960</li>
                                                <li>ul. Bieżanowska 258B, 30-856, Kraków</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        )
    }

    const _renderMailForm = () => {
        const { name, surname, email, topic, description } = state;
        return (
            <div className="col-lg-10">
                <div className="custom-form mt-3">
                    <div id="message"></div>
                    <div name="contact-form" id="contact-form">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="form-group mt-2">
                                    <input name="name" id="name" value={name} onChange={e => _handleChangeValue(e)} className="form-control" placeholder="Imię"
                                        type="text" />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-group mt-2">
                                    <input name="surname" id="surname" value={surname} onChange={e => _handleChangeValue(e)} className="form-control" placeholder="Nazwisko"
                                        type="text" />
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="form-group mt-2">
                                    <input name="email" id="email" value={email} onChange={e => _handleChangeValue(e)} className="form-control" placeholder="Email"
                                        type="email" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="form-group mt-2">
                                    <input className="form-control" value={topic} onChange={e => _handleChangeValue(e)} name="topic" id="subject" placeholder="Temat" type="text" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="form-group mt-2">
                                    <textarea name="description" value={description} onChange={e => _handleChangeValue(e)} id="comments" rows="4" className="form-control"
                                        placeholder="Wiadomość"></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 mt-3 text-center">
                                <button id='send' name="send" className="submitBnt btn btn-custom btn-round" onClick={_handleSendMail}>Wyślij wiadomość</button>
                                <div id="simple-msg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return _renderContent();
}

export default Home;