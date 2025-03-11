import React, { FC } from "react";
import { Typography } from "plxp-web-ui/components/base";
import * as Globals from "@Enum";
import { Localizer } from "@bungie/localization";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import PlatformButton from "../AuthPlatformButton";
import styles from "./AuthPlatformSelect.module.scss";

interface AuthPlatformSelectProps {}

const BungieLogo: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="92"
    height="92"
    viewBox="0 0 92 92"
    fill="none"
  >
    <path
      fill={"#F1F1F1"}
      d="m82.556 48.541-3.438-2.566V10l-32.365 1.566L14.38 10v9.181l-5.037-2.01-.046-.019H9.25a.733.733 0 0 0-.268-.046h-.046a.961.961 0 0 0-.684.324.969.969 0 0 0-.25.714c.019.333.204.63.49.806l5.471 3.39.425.26v23.607c.047 10.145 7.68 18.733 15.212 24.96 7.412 6.086 14.917 9.931 15.86 10.403l.71.362.639.324 1.247-.686c.629-.314 8.29-4.187 15.86-10.404 6.847-5.66 13.75-13.286 14.98-22.245l2.69 1.325.064.037.074.019c.102.028.194.037.286.037.296 0 .536-.12.721-.315A.971.971 0 0 0 83 49.31a.955.955 0 0 0-.425-.769h-.018Zm-67.04-37.346 31.228 1.51h.028l31.2-1.51v33.937l-1.534-1.149v-1.13l.009-30.231-29.694 1.445-29.684-1.436v7.625l-1.553-.62v-8.44Zm49.748 9.219v-1.4h5.12l-2.975 7.07h-1.655l2.45-5.67h-2.94ZM45.044 35.32c.757.305 1.155 1.074 1.155 1.074l1.857 3.41 6.054 4.011c-.536.973-.73 1.752-.832 2.057a4.535 4.535 0 0 0-.065.223l.869 4.586s-.083.018-.13.037c-1.044.352-1.996.89-3.003 1.464l-.536.305c-.176.102-.351.204-.536.297l-.037.018a4.66 4.66 0 0 1-.776.362c-.453.166-.897.25-1.303.25-.537 0-.97-.12-1.257-.195l-.231-.065h-.037c-.73-.148-1.83-1.084-2.708-1.843-.592-.51-1.146-.992-1.682-1.325a6.367 6.367 0 0 0-.85-.445l-.074-.037s-.047-.019-.065-.028l1.395-4.92s-.009-.009-.009-.018l-5.545-9.06a.452.452 0 0 1 .037-.594l3.78-7.06a.468.468 0 0 1 .259-.185c.037-.01.064-.018.101-.018h.019c.083 0 .166.018.23.064l3.642 1.538h.01l4.093 1.844a.447.447 0 0 1 .231.584l-1.7 2.724a.458.458 0 0 1-.397.287h-.01a.523.523 0 0 1-.166-.028l-3.881-1.556-.583.963s.601.241 2.662 1.288l.018-.01Zm20.073 21.577c.092 0 .184-.009.277-.018.101-.01.194-.019.286-.019.222 0 .425.056.509.306.175.5-.435 1.084-.564 1.538-.056.185-.028.435-.093.63-.277.788-.896 1.464-1.303 2.187a.768.768 0 0 1-.314-.093c-.416-.232.952-1.825 1.063-2.02.259-.445-2.274-.445-2.421-.519-.527-.26-.925-.945-1.128-1.473-.212-.546-.379-1.547.323-1.806a.773.773 0 0 1 .287-.047c.065 0 .139 0 .203.01.065 0 .139.009.204.009.101 0 .194-.01.295-.047.26-.092.481-.398.647-.583-.748-.603-1.441-.816-2.125-.816-1.183 0-2.338.64-3.67 1.112-.905.176-1.737.306-2.106.38-1.59.324-3.17 1.686-4.427 2.113 0 0-1.599.602-3.253.602-.167 0-.324 0-.48-.019-1.812-.139-2.995-.157-5.712-2.455-1.414-1.121-1.775-1.927-5.453-2.696-1.627-.324-3.105-.704-3.022-1.621.028-.575.989-1.112.74-1.687-.13-.305-.26-1.028-.047-1.5-.462-.88-.896-1.075-2.153-1.474a4.953 4.953 0 0 0-1.359-.222h-.046c.046.26.065.528.019.778-.176.964-.5 1.992-1.405 1.992-.065 0-.139 0-.213-.018-.055-.14.518-.797-.388-1.872-.545-.63-1.654-2.436-.453-3.298.083-.056.185-.12.314-.185.019-.01.028-.019.047-.028a2.91 2.91 0 0 1 1.284-.278c.647 0 1.47.176 2.486.713.259.223 2.033.482 3.244.686.222.037.434.074.61.111 1.322.26 2.338 1.5 1.405 2.427-.61.5-1.571 1.186-1.1 1.4.019 0 .028.009.056.018.046 0 .12.019.212.037.056.01.102.019.148.037.379.093.758.176 1.118.269.028.009.065.018.093.018.064.019.12.028.184.047.712.194 1.535.444 2.237.722.055.019.11.047.157.065.083.037.157.074.24.111.268.12.518.241.712.37 1.368.881 3.216 3.021 4.75 3.308.268.065.878.288 1.71.288.48 0 1.035-.084 1.645-.306.305-.111.62-.241.952-.436.203-.11.397-.222.6-.333 1.147-.649 2.219-1.297 3.328-1.677.508-.167 1.025-.287 1.561-.306h.056c.785-.092 1.534-.13 1.765-.213 1.174-.37 2.366-.797 3.586-.797.434 0 .878.056 1.322.186.951.287 1.71.935 2.3 1.723.241.324 1.442 2.01 1.11 2.427-.36.473-1.156.973-1.257 1.603-.074.51.12.612.397.612l.01.027Zm-13.124 9.32c.148 0 .093.205.194.158.102-.046.185-.065.25.102.074.223-.203.13-.13.223.093.13-.23.574-.434.676-.203.093-.194-.158-.342-.158-.157 0-.102.093-.175-.027-.074-.13-.019-.223.055-.297.074-.074-.01-.204-.01-.204l-.369-1.176-3.124 2.538 3.133 2.789s.509 1.075.26 1.065c-.63-.018-1.055-.11-1.055-.11l-3.465-2.827-3.466 2.826s-.425.093-1.053.111c-.26.01.258-1.065.258-1.065l3.133-2.789-3.123-2.538-.37 1.176s-.092.13-.01.204c.075.074.13.176.056.297-.074.13-.018.027-.175.027-.148 0-.14.25-.342.158-.204-.093-.527-.547-.435-.676.074-.093-.212 0-.13-.223.066-.167.149-.148.25-.102.102.047.047-.148.194-.157.222 0 .306-1.64.306-1.64l-1.923-1.705-.286-.333s-.305.055-.509-.14c-.212-.194-.268-.74-.064-.981.194-.232.61-.278.96.074.204.194.167.417.167.417l.351.296 2.034 1.557s1.617-.547 1.598-.705c-.018-.157.195-.12.13-.213-.065-.092-.093-.176.074-.26.212-.101.148.186.24.103.11-.111.61.148.73.333.12.186-.139.214-.12.362.018.148.11.092 0 .176-.12.092-.222.046-.305-.028-.11-.093-.056-.139-.056-.139l-1.266.852 3.143 2.798 3.142-2.798-1.266-.852s.064.046-.056.139c-.083.065-.185.111-.305.028-.12-.084-.018-.028 0-.176.019-.148-.24-.176-.12-.362.12-.185.62-.444.73-.333.083.083.028-.213.24-.102.167.074.14.167.074.26-.055.092.148.064.13.212-.01.149 1.599.705 1.599.705l2.033-1.557.351-.296s-.046-.223.157-.417c.36-.343.776-.306.97-.074.204.25.148.787-.064.982-.203.194-.508.139-.508.139l-.287.333-1.922 1.705s.101 1.63.314 1.64h.01Zm-4.075-41.024-2.154 3.576-.527-.222-.12-.055-.554-.232-2.791-1.195 2.412-4.067a.43.43 0 0 1 .379-.214h.018a.49.49 0 0 1 .222.056l2.958 1.751c.212.12.286.398.157.602Zm.776.5a.47.47 0 0 1 .37-.212h.018c.074 0 .157.018.231.064l2.708 1.603a.44.44 0 0 1 .148.612l-.13.203s-.018.019-.027.038l-1.035 1.667-.97 1.557s-.029-.084-.038-.12a1.265 1.265 0 0 0-.471-.585 1.118 1.118 0 0 0-.305-.185l-2.615-1.176 2.125-3.456-.01-.01Zm-.102 9.312 1.396-2.224 2.69-4.354a.44.44 0 0 1 .378-.213c.074 0 .157.018.222.064l2.43 1.436c.204.13.268.399.139.612l-2.421 3.863-.315.52-1.321 2.112s-.037.064-.056.101a.447.447 0 0 1-.36.195.438.438 0 0 1-.231-.065l-2.43-1.436a.446.446 0 0 1-.14-.611h.02Zm3.9 2.242 3.78-6.04a.475.475 0 0 1 .38-.214c.082 0 .165.018.23.065l1.922 1.149c.213.13.278.398.148.611l-3.78 6.04a.462.462 0 0 1-.378.214.387.387 0 0 1-.222-.065L52.64 37.85a.428.428 0 0 1-.139-.602h-.009ZM8.89 18.255a.165.165 0 0 1-.093-.148c0-.102.074-.186.176-.195l.064.01L30.552 26.5l-.406-7.533 10.905 7.736s-.13-.055-.314-.055a.853.853 0 0 0-.296.046c-.342.102-.416.324-.416.324l-.185.353s-.009 0-.009.009l-.019.027v.028l-2.005 3.715-2.773-1.945-1.173 4.53L8.89 18.255Zm54.295 52.04c-7.458 6.133-15.055 9.978-15.656 10.284l-.748.408-.102-.056-.351-.176-.314-.167c-.656-.324-8.244-4.169-15.684-10.293-7.458-6.142-14.786-14.555-14.796-24.079V23.314l1.137.704.425.259v21.948c0 18.16 27.892 32.409 29.084 33.002l.638.324.591-.325c1.156-.583 27.56-14.082 28.992-31.546l1.173.584.26.13c-1.008 8.625-7.736 16.24-14.621 21.901h-.028Zm18.816-20.753-.064-.01-17.301-8.541-1.192 8.005-14.528-9.747-1.987-3.678 6.367 3.613.86.519c.11.074.25.111.388.139.092.028.194.046.296.046h.009c.286 0 .554-.111.758-.315a1.09 1.09 0 0 0 .258-.287l.463-.741.443-.658 3.355 2.78 1.063-7.051 20.914 15.593a.209.209 0 0 1 .092.148.192.192 0 0 1-.175.194L82 49.542Z"
    />
  </svg>
);

/* NOTE:
 * Battlenet and Stadia are sunset as authentication credentials on Bnet (technically you can still have a stadia account as your primary crosssave account) - 1/2025
 * */

const AuthPlatformSelect: FC<AuthPlatformSelectProps> = () => {
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedinuser",
    "coresettings",
  ]);

  const { coreSettings } = globalState;
  const psnSystem = coreSettings.systems.PSNAuth;
  const xuidSystem = coreSettings.systems.XuidAuth;
  const steamSystem = coreSettings.systems.SteamIdAuth;
  const egsSystem = coreSettings.systems.EpicIdAuth;
  const twitchSystem = coreSettings.systems.Twitch;

  /* Strings */
  const AuthLoc = Localizer.webauth;
  const {
    PlatformSelectHeader,
    PlatformSelectSubheader,
    PlatformSelectSocialAccount,
  } = AuthLoc;

  return (
    <>
      <div className={styles.container}>
        <BungieLogo />
        <Typography variant={"h6"} component={"h1"}>
          {PlatformSelectHeader}
        </Typography>
        <Typography variant={"body1"}>{PlatformSelectSubheader}</Typography>
      </div>

      <div className={styles.buttonWrapper}>
        {psnSystem?.enabled && (
          <PlatformButton credentialType={Globals.BungieCredentialType.Psnid} />
        )}
        {steamSystem?.enabled && (
          <PlatformButton
            credentialType={Globals.BungieCredentialType.SteamId}
          />
        )}
        {xuidSystem?.enabled && (
          <PlatformButton credentialType={Globals.BungieCredentialType.Xuid} />
        )}
        {egsSystem?.enabled && (
          <PlatformButton credentialType={Globals.BungieCredentialType.EgsId} />
        )}
        <Typography variant={"body1"} align={"center"}>
          {PlatformSelectSocialAccount}
        </Typography>
        {twitchSystem?.enabled && (
          <PlatformButton
            display={"icon"}
            credentialType={Globals.BungieCredentialType.TwitchId}
            aria-label={Localizer.Registration.networksigninoptiontwitch}
          />
        )}
      </div>
    </>
  );
};

export default AuthPlatformSelect;
