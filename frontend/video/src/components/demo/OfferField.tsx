import { Button, TextField } from "@mui/material";

interface IOfferFieldProps {
  value: number;
  index: number;
  createOffer: () => Promise<void>;
  setAnswer: () => Promise<void>;
  localSDP: string;
  answerInput: string;
  setAnswerInput: React.Dispatch<React.SetStateAction<string>>;
}

const OfferField = ({
  value,
  index,
  createOffer,
  setAnswer,
  localSDP,
  answerInput,
  setAnswerInput,
}: IOfferFieldProps) => {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <div>
          <div className="flex flex-col gap-2 p-4">
            <p>Create an Offer and Copy the below SDP to answer</p>
            <Button
              variant="contained"
              onClick={createOffer}
              className="w-[200px]"
            >
              Create Offer
            </Button>
            <TextField
              label="Offer SDP"
              multiline
              minRows={4}
              maxRows={4}
              value={localSDP}
            />
          </div>
          <div className="flex flex-col gap-2 p-4">
            <p>Paste the answer SDP and Set the answer</p>
            <Button
              variant="contained"
              onClick={setAnswer}
              className="w-[200px]"
            >
              Set Answer
            </Button>
            <TextField
              label="Answer SDP"
              multiline
              minRows={4}
              maxRows={4}
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferField;
