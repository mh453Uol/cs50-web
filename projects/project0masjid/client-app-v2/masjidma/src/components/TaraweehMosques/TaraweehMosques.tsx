import { TaraweehMosque } from '../../models/TaraweehMosque';

interface Props {
  mosques: TaraweehMosque[];
}

const TaraweehMosques = ({ mosques }: Props) => {
  return (
    <div data-testid="TaraweehMosques">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-dark text-white" id="taraweeh-header">
          <h2 className="mb-0">
            <i className="bi bi-building me-2"></i> Taraweeh Prayers
            <small className="\d-block text-light opacity-75" style={{ fontFamily: "'Amiri', 'Times New Roman', serif" }}> صلاة التراويح</small>
          </h2>
        </div>
        <div className="card-body">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {mosques.map((mosque) => (
              <div key={mosque.id} className="col">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-start mb-3">
                      <i className="bi bi-building display-5 text-warning me-3"></i>
                      <div className="flex-grow-1">
                        <h5 className="card-title mb-1">{mosque.name}</h5>
                        {/* {mosque.address && (
                          <p className="card-text mb-0 text-muted">
                            <i className="bi bi-geo-alt me-1"></i> {mosque.address}
                          </p>
                        )} */}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="d-flex align-items-start mb-2">
                        <i className="bi bi-clock text-warning me-3"></i>
                        <div>
                          <span className="fw-bold">Time: </span>
                          <span>{mosque.time}</span>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-start mb-2">
                        <i className="bi bi-people text-warning me-3"></i>
                        <div>
                          <span className="fw-bold">Sisters:</span>
                          <p className="mb-0 text-muted">{mosque.familyFriendly}</p>
                        </div>
                      </div>
                      
                      {mosque.description && (
                        <div className="d-flex align-items-start">
                          <i className="bi bi-sticky text-warning me-3"></i>
                          <div>
                            <span className="fw-bold">Parking:</span>
                            <p className="mb-0 text-muted">{mosque.description}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaraweehMosques;
