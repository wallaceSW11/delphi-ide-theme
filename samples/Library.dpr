library SampleLibrary;

uses
  System.SysUtils,
  System.Classes,
  Everything in 'Everything.pas';

{$R *.res}

function CreatePerson(const AName: PChar; AAge: Integer): TPerson; stdcall;
begin
  Result := TPerson.Create(string(AName), AAge);
end;

procedure FreePerson(APerson: TPerson); stdcall;
begin
  APerson.Free;
end;

function GetPersonInfo(APerson: TPerson): PChar; stdcall;
begin
  Result := PChar(APerson.Introduce('Library'));
end;

procedure LogToLibrary(const AMsg: PChar); stdcall;
begin
  LogMessage(string(AMsg));
end;

function AddValues(A, B: Double): Double; stdcall;
begin
  Result := A + B;
end;

function MultiplyValues(A, B: Double): Double; stdcall;
begin
  Result := A * B;
end;

function GetVersion: PChar; stdcall;
begin
  Result := PChar('1.0.0');
end;

exports
  CreatePerson,
  FreePerson,
  GetPersonInfo,
  LogToLibrary,
  AddValues,
  MultiplyValues,
  GetVersion;

begin
end.
