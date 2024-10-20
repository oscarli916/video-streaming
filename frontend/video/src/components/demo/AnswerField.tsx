import { Button, TextField } from "@mui/material";

interface IAnswerFieldProps {
  value: number;
  index: number;
  setOffer: () => Promise<void>;
  offerInput: string;
  setOfferInput: React.Dispatch<React.SetStateAction<string>>;
  createAnswer: () => Promise<void>;
  localSDP: string;
}

const AnswerField = ({
  value,
  index,
  setOffer,
  offerInput,
  setOfferInput,
  createAnswer,
  localSDP,
}: IAnswerFieldProps) => {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <div>
          <div className="flex flex-col gap-2 p-4">
            <p>Paste the offer SDP and Set the offer</p>
            <Button
              variant="contained"
              onClick={setOffer}
              className="w-[200px]"
            >
              Set Offer
            </Button>
            <TextField
              label="Offer SDP"
              multiline
              minRows={4}
              maxRows={4}
              value={offerInput}
              onChange={(e) => setOfferInput(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 p-4">
            <p>Create an Answer and Copy the below SDP to offer</p>
            <Button
              variant="contained"
              onClick={createAnswer}
              className="w-[200px]"
            >
              Create Answer
            </Button>
            <TextField
              label="Offer SDP"
              multiline
              minRows={4}
              maxRows={4}
              value={localSDP}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerField;
