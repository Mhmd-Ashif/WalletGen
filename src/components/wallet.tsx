import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Copy, CopyIcon, Trash } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { HDNodeWallet } from "ethers";
import nacl from "tweetnacl";

export default function Wallet({ sendData }: any) {
  const [phrases, setPhrases] = useState<any>();
  const [seed, setSeed] = useState<any>();
  const path = localStorage.getItem("Path");
  const [keys, setKeys] = useState<any>([]);
  const [newKeyIndex, setNewKeyIndex] = useState<number | null>(null);

  useEffect(() => {
    const sp: any = localStorage.getItem("Phrases");
    const allKeys: any = localStorage.getItem("keys");
    const seed = mnemonicToSeedSync(sp);
    setSeed(seed);
    setPhrases(sp?.split(" "));
    setKeys(JSON.parse(allKeys) || []);
  }, []);

  function GeneratePhrase() {
    const mnemonic = generateMnemonic();
    console.log(mnemonic);
    const seed = mnemonicToSeedSync(mnemonic);
    console.log(seed);
    setPhrases(mnemonic.split(" "));
    setSeed(seed);
    localStorage.setItem("Phrases", mnemonic);
  }

  function handleDelAllWallets() {
    localStorage.removeItem("Path");
    localStorage.removeItem("Phrases");
    localStorage.removeItem("keys");
    sendData(null);
    toast("Wallets Deleted Successfully");
  }

  function createSol() {
    let i = keys.length;
    console.log("this is inde", i);
    const path = `m/44'/501'/${i}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    console.log("this is err");
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
    const privateKey = Buffer.from(secret).toString("hex");
    console.log("this is private ", Buffer.from(secret).toString("hex"));
    console.log(
      "this is public ",
      Keypair.fromSecretKey(secret).publicKey.toBase58()
    );
    setKeys((keys: any) => {
      const updated = [...keys, { publicKey, privateKey }];
      setNewKeyIndex(updated.length - 1);
      return updated;
    });
    const setLocal = [...keys, { publicKey, privateKey }];

    localStorage.setItem("keys", JSON.stringify(setLocal));
    toast("Sol Wallet Created Successfully");
  }

  function createEth() {
    let i = keys.length;
    const path = `m/44'/60'/${i}'/0'`;
    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(path);
    console.log("this is private key ", child.privateKey);
    console.log("this is public key ", child.address);

    setKeys((keys: any) => {
      const updated = [
        ...keys,
        { publicKey: child.address, privateKey: child.privateKey },
      ];
      setNewKeyIndex(updated.length - 1);
      return updated;
    });
    const setLocal = [
      ...keys,
      { publicKey: child.address, privateKey: child.privateKey },
    ];

    localStorage.setItem("keys", JSON.stringify(setLocal));
    toast("Eth Wallet Created Successfully");
  }

  function deletekeys(i: number) {
    setKeys((keys: any) => keys.filter((_: any, index: any) => index !== i));
    const allKeys: any = JSON.parse(localStorage.getItem("keys") || "");
    const setNew = allKeys.filter((_: any, index: any) => index !== i);
    localStorage.setItem("keys", JSON.stringify(setNew));
    toast(`Wallet ${i + 1} Deleted Successfully`);
  }

  return (
    <>
      <div className="mt-8">
        {phrases ? (
          <div className="border pl-4 pr-4 rounded-md fade-in">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="hover:no-underline text-2xl">
                  Recovery Phrases
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-4 gap-4">
                    {phrases.map((word: string) => {
                      return (
                        <div className="bg-neutral-700/20 hover:bg-neutral-700/30 text-base md:text-lg text-center rounded-sm h-10 place-content-center">
                          {word}
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    className="mt-5 opacity-40 hover:opacity-85"
                    variant={"ghost"}
                    onClick={() => {
                      navigator.clipboard.writeText(phrases.join(" "));
                      toast("Recovery Phrase Copyied Successfully");
                    }}
                  >
                    <Copy />
                    Click to Copy
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ) : (
          <div className="fade-in">
            <h2 className="text-2xl md:text-4xl font-semibold">
              Generate Recovery Phrases
            </h2>
            <Button onClick={GeneratePhrase} className="mt-2 " size={"lg"}>
              Generate Phrases
            </Button>
          </div>
        )}

        {phrases && path ? (
          <div className="mt-5  font-semibold md:flex justify-between items-center fade-in">
            <div className="text-3xl md:text-4xl items-center">
              {`${parseInt(path) == 501 ? "Solana" : "Ethereum"} Wallets`}
            </div>
            <div className="space-x-4 flex items-center mt-2 md:mt-0">
              <Button
                className="h-10"
                onClick={parseInt(path) == 501 ? createSol : createEth}
              >
                Generate Wallets
              </Button>
              <Button variant={"destructive"} className="h-10">
                <AlertDialog>
                  <AlertDialogTrigger>Delete Wallet</AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently All
                        the Wallets
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>No</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelAllWallets}>
                        Yes
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Button>
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="mt-8">
          {keys.map((key: any, i: number) => (
            <div
              key={i}
              className={`border rounded-2xl mt-6 ${
                i === newKeyIndex ? "fade-in" : ""
              }`}
              onAnimationEnd={() => {
                if (i === newKeyIndex) setNewKeyIndex(null);
              }}
            >
              <div className="flex justify-between pl-4 pr-4 pt-6 pb-6 ">
                <h3 className="text-xl md:text-2xl font-semibold">{`Wallet ${
                  i + 1
                }`}</h3>
                <Button size={"sm"} variant={"ghost"}>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      {" "}
                      <Trash className="text-red-800"></Trash>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you Sure Wants To Delete the Wallet
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          The selected Wallet
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>No</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deletekeys(i)}>
                          Yes
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Button>
              </div>
              <div className="dark:bg-neutral-900 bg-neutral-100 rounded-t-xl rounded-b-2xl pt-6 pb-6">
                <div className="pl-4 pr-4 ">
                  <div className="text-xl font-semibold">Public Key</div>
                  <div className="mt-2 break-all">{key.publicKey}</div>
                </div>
                <div className="pl-4 pr-4 rounded-md mt-4">
                  <div className="text-xl font-semibold">Private Key</div>
                  <div className="mt-2 flex space-x-6 md:space-x-16 items-center ">
                    <div className=" truncate w-full ">{key.privateKey}</div>
                    <Button
                      variant={"ghost"}
                      onClick={() => {
                        navigator.clipboard.writeText(key.privateKey);
                        toast("Private Key Copyied Successfully");
                      }}
                    >
                      <CopyIcon size={18} className="text-neutral-500" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
