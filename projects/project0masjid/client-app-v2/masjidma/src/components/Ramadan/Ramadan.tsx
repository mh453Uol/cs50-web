import { Tenant } from '../../models/Tenant';
import TaraweehMosques from '../TaraweehMosques/TaraweehMosques';
import { TaraweehMosque } from '../../models/TaraweehMosque';

// Sample data for Taraweeh mosques - in a real application, this would come from an API
const taraweehMosques: TaraweehMosque[] = [
  {
    id: 1,
    name: "Aylesbury Mosque",
    time: "Start: Pending",
    familyFriendly: "Side room located at the right side of the masjid reserved for Sisters.",
    description: "Alfred Rose Community Centre Car Park and Crown Leys. Imams: Hafiz Jamil",
  },
  {
    id: 2,
    name: "Southcourt Mosque",
    time: "Start: Pending",
    familyFriendly: "The upstairs of the masjid is wholly reserved for women this year for Taraweeh. Please make wudu at home.",
    description: "Pebble brook school and Southcourt community centre.",
  },
  {
    id: 3,
    name: "The Aylesbury Vale Academy - Berryfield",
    time: "Start: 7:45, Monday to Saturday venue is AVA Primary and Sunday AVA Main Hall",
    description: "Hall booked from Tuesday 17th Feb, Imams - Maulana Haroon, Maulana Uzair, Luqman, Dayaan and Shoaib (Students)",
    familyFriendly: "Sisters and children are welcomed to join us, please make wudu at home",
  },
    {
    id: 4,
    name: "Faizan-e-Siddeeq-e-Akbar",
    time: "Start: Pending",
    familyFriendly: "Sisters welcome, dedicated spaces for ladies",
    description: "Please walk if you are local or car share"
  }
];

const Ramadan = ({ tenant }: { tenant: Tenant }) => {
  return (
    <div data-testid="Ramadan" className="bg-light py-5">
      <div className="container">
        {/* Header Section */}
        <div className="row align-items-center mb-4">
          <div className="col-12">
            <h1 className="display-4 fw-bold text-center">
              <i className="bi bi-moon-stars text-warning me-2"></i> Ramadan Kareem
              <small className="d-block text-muted fs-6" style={{ fontFamily: "'Amiri', 'Times New Roman', serif" }}>رمضان كريم</small>
            </h1>
            <p className="lead text-center text-secondary">
              Ramadan is one of the most special and loved months in the Islamic calendar - a time for reflection, prayer, and reward.
            </p>
          </div>
        </div>

        {/* Main  Content */}
        <div className="row g-4">
          {/* Taraweeh Mosques Section */}
          <div className="col-12" id="taraweeh-mosques">
            <TaraweehMosques mosques={taraweehMosques} />
          </div>

          {/* Ramadan Timetable Section */}
          <div className="col-12" id="ramadan-timetable">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-dark text-white" id="ramadan-timetable-header">
                <h2 className="mb-0">
                  <i className="bi bi-calendar me-2"></i> Ramadan Timetable
                  <small className="d-block text-light opacity-75" style={{ fontFamily: "'Amiri', 'Times New Roman', serif" }}>جدول رمضان</small>
                </h2>
              </div>
              <div className="card-body">
                {tenant?.ramadanTimetable ? (
                  <div className="text-center">
                    <a href={tenant.ramadanTimetable} target="_blank" rel="noreferrer" className="text-decoration-none">
                      <img 
                        src={tenant.ramadanTimetable} 
                        className="img-fluid rounded shadow" 
                        alt={`${tenant.name} Ramadan Timetable`}
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    </a>
                  </div>
                ) : (
                  <div className="alert alert-info d-flex align-items-center">
                    <i className="bi bi-info-circle fs-4 me-3"></i>
                    <div>
                      <h5 className="mb-1">Ramadan timetable will be available soon</h5>
                      <p className="mb-0">Please check back later for the updated timetable.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Ramadan Information */}
          <div className="col-12" id="ramadan-information">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-dark text-white">
                <h2 className="mb-0">
                  <i className="bi bi-book me-2"></i> Ramadan Information
                  <small className="d-block text-light opacity-75" style={{ fontFamily: "'Amiri', 'Times New Roman', serif" }}>معلومات رمضان</small>
                </h2>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-6 col-lg-3">
                    <div className="card h-100 border-0 bg-light">
                      <div className="card-body text-center">
                        <i className="bi bi-person-standing-dress display-4 text-warning mb-3"></i>
                        <h5 className="card-title">Iftar at the mosque </h5>
                        <p className="card-text">
                          Following mosques provide iftar to local residents:
                          <ul>
                            <li>Southcourt mosque</li>
                            <li>Aylesbury mosque</li>
                            <li>Faizan-e-Siddeeq-e-Akbar</li>
                          </ul>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 col-lg-3">
                    <div className="card h-100 border-0 bg-light">
                      <div className="card-body text-center">
                        <i className="bi bi-book-half display-4 text-warning mb-3"></i>
                        <h5 className="card-title">Quran Recitation</h5>
                        <p className="card-text">Take this blessed month to complete the Quran. Set daily goals and make dua for acceptance.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 col-lg-3">
                    <div className="card h-100 border-0 bg-light">
                      <div className="card-body text-center">
                        <i className="bi bi-heart display-4 text-warning mb-3"></i>
                        <h5 className="card-title">Charity & Sadaqah</h5>
                        <p className="card-text">Give generously during Ramadan. Even small acts of kindness are greatly rewarded in this month.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 col-lg-3">
                    <div className="card h-100 border-0 bg-light">
                      <div className="card-body text-center">
                        <i className="bi bi-building display-4 text-warning mb-3"></i>
                        <h5 className="card-title">Jumu'ah Prayers</h5>
                        <p className="card-text">Don't miss the special Jumu'ah prayers during Ramadan. They carry extra blessings and mercy.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Ramadan;
