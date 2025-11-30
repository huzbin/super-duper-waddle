import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { useTranslation } from "react-i18next";
import { getFlagIconClass } from "@/utils/regionUtils";

const languages = [
  { code: 'en', name: 'English', countryCode: 'us' },
  { code: 'zh-CN', name: '中文', countryCode: 'cn' },
  { code: 'ja', name: '日本語', countryCode: 'jp' },
];

export function LanguageSwitch() {
  const { i18n } = useTranslation();

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    // Save to localStorage for Komari theme compatibility
    localStorage.setItem('i18nextLng', languageCode);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" size="sm" className="min-w-unit-20">
          <span className={`${getFlagIconClass(currentLanguage.countryCode)} mr-2`} />
          <span className="hidden sm:inline">{currentLanguage.name}</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language selection"
        selectionMode="single"
        selectedKeys={[i18n.language]}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0] as string;
          handleLanguageChange(selectedKey);
        }}
      >
        {languages.map((language) => (
          <DropdownItem key={language.code}>
            <div className="flex items-center gap-2">
              <span className={getFlagIconClass(language.countryCode)} />
              <span>{language.name}</span>
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}