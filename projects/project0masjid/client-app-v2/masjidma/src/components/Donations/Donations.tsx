import { useHistory } from "react-router-dom";
import { Tenant } from "../../models/Tenant";

const Donations = ({tenant}: { tenant: Tenant}) => {
    const history = useHistory();

    const isAcceptingDonations = tenant.donationLink;

    if (!isAcceptingDonations) {
        history.push("/")
    }

    return (
        <iframe 
            src="https://hibabox.com/ghausia-committee-aylesbury" 
            title={`${tenant.name} donation page`} 
            height={window.screen.height}
            width={window.screen.width}
            style={{border: "none"}}>
        </iframe>
    )
}
export default Donations;