#!/usr/bin/env bash

# https://stackoverflow.com/questions/5947742/how-to-change-the-output-color-of-echo-in-linux
Cyan='\033[0;36m'         # Cyan
Red='\033[0;31m'          # Red
Purple='\033[0;35m'       # Purple
Yellow='\033[0;33m'       # Yellow
BPurple='\033[1;35m'      # Purple bold
UGreen='\033[4;32m'       # Green underline

# json config
jsonConfig='mockdata.config.json'

# Main script
init() {
  # Welcome text
  echo -e "${Cyan}::: ${BPurple}aap-arenavisningklient mockdata generator ${Cyan}::: \n"

  # Check if jq package is installed
  verifyJQ

  # Generate azure-token-generator token
  startTokenGenerator

  # Finished
  sleep 1
  echo -e "🌈 ${Purple}You're good to go! Mockdata should be updated!"
}

# Check if user has `jq` installed
# https://formulae.brew.sh/formula/jq
verifyJQ() {
  if command -v jq > /dev/null; then
    # jq already installed, continue script
    return
  else
    # jq not found
    # ask user to install jq
    echo -e "${Yellow}🟡 jq not found. jq is required for token-generator script."
    echo -e "${Yellow}🟡 Read more about jq: ${UGreen}https://formulae.brew.sh/formula/jq${Cyan}\n"

    # ask for user input y or n
    read -p "Install jq (y/n)? " answer

    if [ "$answer" = "y" ]; then
      if [ "$(uname)" == "Darwin" ]; then
          brew install jq
      elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
          sudo apt install jq
      fi
      echo -e "\n"
    else
      echo -e "🛑 ${Red}Token generator aborted."
      exit 1
    fi
  fi
}

# Start token generation process
start() {
  url = "https://azure-token-generator.intern.dev.nav.no/api/obo?aud=dev-fss.aap.arenaoppslag"

  # Show link to azureTokenGenerator to user
  echo -e "${Cyan}Visit: ${UGreen}${url}\n"
  echo -e "${Cyan}Find and copy ${Yellow}access-token${Cyan} that is shown in the browser"

  # Ask for wonderwall cookie,
  echo -e "${Cyan}Paste in token: "
  read cookie
  echo -e "\n"

  configArray=$(jq -r '.[] | @base64' $jsonConfig)

  # TODO: Implement me!

  echo -e "\n"
}