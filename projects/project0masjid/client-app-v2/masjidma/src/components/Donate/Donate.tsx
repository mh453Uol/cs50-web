import { Button, Card } from "react-bootstrap";
import { Tenant } from "../../models/Tenant";

const Donate = ({ tenant }: { tenant: Tenant }) => {
    const onClickHandler = (url: string) => {
        window.location.href = url;
    }

    return (
        <Card className="text-center">
            <Card.Body>
                {/* <Card.Title className="text-center">Support {tenant.name}</Card.Title> */}
                {/* <Card.Text>
                    As-salamu alaykum, beloved members of our mosque community! Today, we come together not only as individuals but as a unified force of faith and compassion. Our mosque serves as a sanctuary, a place where hearts find solace we rely on the generosity of our community members.
                </Card.Text> */}
                <Button variant="primary" onClick={() => onClickHandler(tenant?.donationLink || '')}>💷 Donate</Button>
                <Button variant="secondary" className="ml-2" onClick={() => onClickHandler("https://forms.gle/EhfjeNxcEaLVFhwV9")}>🖐️ Volunteer</Button>
            </Card.Body>
        </Card>
    );
}
export default Donate;