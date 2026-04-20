import * as React from "react";
import { Button } from "./Button";
import { Select } from "./Select";
import { Switch } from "./Switch";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Label } from "./Label";
import { Icon } from "./Icon";
import { useTranslation } from "react-i18next";

interface Address {
    label: "home" | "work" | "partner" | "other";
    name: string;
    district: string;
    address: string;
    phone: string;
    notes?: string;
}

export const AddressManager: React.FC<{ onSaveAddress: (address: Address, isDefault: boolean) => void }> = ({ onSaveAddress }) => {
    const { t } = useTranslation("global");
    const [currentAddress, setCurrentAddress] = React.useState<Address>({
        label: "home",
        name: "",
        district: "",
        address: "",
        phone: "",
        notes: ""
    });
    const [isDefaultAddress, setIsDefaultAddress] = React.useState(false);

    React.useEffect(() => {
        const savedAddresses = JSON.parse(localStorage.getItem("addresses") || "{}");
        const defaultAddress = localStorage.getItem("defaultAddress");
        if (defaultAddress) {
            setCurrentAddress(savedAddresses[defaultAddress]);
            setIsDefaultAddress(true);
        } else if (savedAddresses[currentAddress?.label]) {
            setCurrentAddress(savedAddresses[currentAddress?.label]);
        }
    }, [currentAddress?.label]);

    const handleSaveAddress = (e: React.FormEvent) => {
        e.preventDefault();

        const savedAddresses = JSON.parse(localStorage.getItem("addresses") || "{}");
        savedAddresses[currentAddress?.label] = currentAddress;
        localStorage.setItem("addresses", JSON.stringify(savedAddresses));

        if (isDefaultAddress) {
            localStorage.setItem("defaultAddress", currentAddress?.label);
        } else {
            const currentDefault = localStorage.getItem("defaultAddress");
            if (currentDefault === currentAddress?.label) {
                localStorage.removeItem("defaultAddress");
            }
        }

        onSaveAddress(currentAddress, isDefaultAddress);
    };

    const LabelOptions = () => (
        <div className="grid grid-cols-4 gap-4 mt-2">
            {[
                { icon: "home", label: "home" },
                { icon: "briefcase", label: "work" },
                { icon: "heart", label: "partner" },
                { icon: "plus", label: "other" }
            ].map(({ icon, label }) => (
                <Button
                    key={label}
                    type="button"
                    variant={currentAddress?.label === label ? "default" : "outline"}
                    className="flex flex-col items-center gap-2 py-4"
                    onClick={() =>
                        setCurrentAddress((prev) => ({
                            ...prev,
                            label: label as Address["label"]
                        }))
                    }
                >
                    <Icon name={icon} />
                    <span className="capitalize text-xs">{t(`addressManager.labels.${label}`)}</span>
                </Button>
            ))}
        </div>
    );

    return (
        <div className="max-w-sm mx-auto bg-white p-4 rounded-md shadow-lg">
            <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t("addressManager.form.name")}</Label>
                        <Input
                            id="name"
                            type="text"
                            value={currentAddress?.name}
                            onChange={(e) => setCurrentAddress({ ...currentAddress, name: e.target.value })}
                            required
                            placeholder={t("addressManager.form.name")}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">{t("addressManager.form.address")}</Label>
                        <Input
                            id="address"
                            type="text"
                            value={currentAddress?.address}
                            onChange={(e) => setCurrentAddress({ ...currentAddress, address: e.target.value })}
                            placeholder={t("addressManager.form.address")}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="district">{t("addressManager.form.district")}</Label>
                        <Select
                            id="district"
                            value={currentAddress?.district}
                            onChange={(e) => setCurrentAddress({ ...currentAddress, district: e.target.value })}
                            required
                        >
                            <option value="">{t("addressManager.districts.select")}</option>
                            <option value="Uttar Badda">{t("addressManager.districts.uttarBadda")}</option>
                            <option value="Banani">{t("addressManager.districts.banani")}</option>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">{t("addressManager.form.phone")}</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={currentAddress?.phone}
                            onChange={(e) => setCurrentAddress({ ...currentAddress, phone: e.target.value })}
                            required
                            placeholder={t("addressManager.form.phone")}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="notes">{t("addressManager.form.notes")}</Label>
                    <Textarea
                        id="notes"
                        placeholder={t("addressManager.form.notesPlaceholder")}
                        value={currentAddress?.notes}
                        onChange={(e) => setCurrentAddress({ ...currentAddress, notes: e.target.value })}
                    />
                </div>

                <Label>{t("addressManager.form.label")}</Label>
                <LabelOptions />

                <div className="space-y-2">
                    <Switch
                        checked={isDefaultAddress}
                        onChange={setIsDefaultAddress}
                        label={t("addressManager.form.defaultSwitch")}
                    />
                </div>

                <div className="flex justify-end">
                    <Button type="submit" className="bg-primary text-white">
                        {t("addressManager.form.saveButton")}
                    </Button>
                </div>
            </form>
        </div>
    );
};
