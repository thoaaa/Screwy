set -e

if [ $# -ne 3 ]
then
	echo "$0 configurationFile sampleFile destinationFile"
	exit -1
fi

config=$1
sample=$2
output=$3

protected_output=$(echo "$output" | sed 's/\([/:.|@#%^&;,!~]\)/\\\1/g')
cp "$sample" "$output"
sed "s/^\([^#]*\)=\([^#]*[^ \t]\)\( *#.*\)\?$/sed -i 's\/##\1##\/\2\/g' \"$protected_output\"/g" "$config" | sh --
