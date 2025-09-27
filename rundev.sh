#!/bin/bash

required=("npm" "gnome-terminal")

# Check for required tools
for cmd in "${required[@]}"; do
	if ! command -v "$cmd" 2>&1 >/dev/null; then
        echo "❌ $cmd not found"
        exit 1
	fi
done

host="localhost"

# Collect CLI arguments
for arg in "$@"; do
    if [[ $arg == --host=* ]]; then
        value="${arg#--host=}"   # strip prefix "--host="
        host="${value%%:*}"      # part before ":"
    fi
done

# Validate host (IPv4)
if [[ $host != localhost ]]; then
    if [[ $host =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}$ ]]; then
        valid_ip=true
        IFS=. read -r a b c d <<< "$host"
        for octet in $a $b $c $d; do
            if (( octet < 0 || octet > 255 )); then
                valid_ip=false
                break
            fi
        done
        if ! $valid_ip; then
            echo "❌ Invalid IP: $host"
            exit 1
        fi
    else
        echo "❌ Invalid IP format: $host"
        exit 1
    fi
fi

script_path=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

client_title='Client'
client_command="cd $script_path/client && npm run dev"
if [[ $host != localhost ]]; then
	client_command+=" -- --host $host"
fi

server_title='Server'
server_command="cd $script_path/server && npm run dev"
if [[ $host != localhost ]]; then
	server_command+=" -- --host=$host"
fi

# Replace host in .env
client_env="client/.env.local"
server_env="server/.env"
sed -i "s|\(VITE_API_URL=http://\)[^:/]\+\(:[0-9]\+\)|\1$host\2|" "$client_env"
sed -i "s|\(CORS_ORIGINS=http://\)[^:/]\+\(:[0-9]\+\)|\1$host\2|" "$server_env"

# Open new tabs and execute commands
gnome-terminal --tab --title="$client_title" -- bash -c "$client_command"
gnome-terminal --tab --title="$server_title" -- bash -c "$server_command"
