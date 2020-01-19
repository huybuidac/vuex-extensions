set -e
echo "Enter release beta version: "
read VERSION

read -p "Releasing $VERSION-beta - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION-beta ..."

  # build
  yarn build

  # run tests
  yarn test:unit

  # commit
  yarn version --new-version $VERSION-beta

  # publish
  git push origin refs/tags/v$VERSION-beta
  git push
  yarn publish --tag beta --new-version $VERSION-beta
fi
