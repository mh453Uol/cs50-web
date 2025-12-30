import { Button, Card } from "react-bootstrap";
import { Tenant } from "../../models/Tenant";

const Donate = ({ tenant }: { tenant: Tenant }) => {
    const onClickHandler = (url: string) => {
        window.location.href = url;
    }

    return (
        <Card className="text-center">
            <Card.Body>
                <Card.Text>
                    <blockquote className="blockquote text-center">
                        <p className="mb-0">Give charity without delay, for it stands in the way of calamity.</p>
                        <footer className="blockquote-footer mt-1"><cite title="Source Title">Prophet Muhammad (ﷺ) Al-Tirmidhi 589</cite></footer>
                    </blockquote>
                </Card.Text>
                <Button variant="secondary" onClick={() => onClickHandler(tenant?.donationLink || '')}>Donate</Button>
            </Card.Body>
        </Card>
    );
}
export default Donate;